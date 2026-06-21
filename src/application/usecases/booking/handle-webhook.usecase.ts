import { inject, injectable } from "inversify";
import { IBookingRepository } from "@domain/interfaces/IBookingRepository";
import { IFlightSeatRepository } from "@domain/interfaces/IFlightSeatRepository";
import { IOfferRepository } from "@domain/interfaces/IOfferRepository";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { IRedisService } from "@application/interfaces/service/cache/IRedis.service";
import { IStripeService } from "@application/interfaces/service/payment/IStripe.service";
import { IEmailService } from "@application/interfaces/service/communication/IEmail.service";
import { ITicketGenerationService } from "@di/file-imports-index";
import { IProviderWalletService } from "@di/file-imports-index";  
import { IHandleWebhookUseCase } from "@di/file-imports-index";
import { TYPES_SERVICES } from "@di/types-services";
import {
  TYPES_BOOKING_REPOSITORIES,
  TYPES_AIRCRAFT_REPOSITORIES,
  TYPES_REPOSITORIES,
} from "@di/types-repositories";

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

@injectable()
export class HandleWebhookUseCase implements IHandleWebhookUseCase {
  constructor(
    @inject(TYPES_BOOKING_REPOSITORIES.BookingRepository)
    private readonly _bookingRepository: IBookingRepository,
    @inject(TYPES_AIRCRAFT_REPOSITORIES.FlightSeatRepository)
    private readonly _flightSeatRepository: IFlightSeatRepository,
    @inject(TYPES_BOOKING_REPOSITORIES.OfferRepository)
    private readonly _offerRepository: IOfferRepository,
    @inject(TYPES_REPOSITORIES.UserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(TYPES_SERVICES.RedisService)
    private readonly _redisService: IRedisService,
    @inject(TYPES_SERVICES.StripeService)
    private readonly _stripeService: IStripeService,
    @inject(TYPES_SERVICES.EmailService)
    private readonly _emailService: IEmailService,
    @inject(TYPES_SERVICES.ProviderWalletService)
    private readonly _providerWalletService:IProviderWalletService,
    @inject(TYPES_SERVICES.TicketGenerationService)
    private readonly _ticketGenerationService: ITicketGenerationService,
   
  ) {}

  async execute(payload: Buffer, signature: string): Promise<void> {
    // ── verify webhook signature ──────────────────────────────────────────
    const event = this._stripeService.constructWebhookEvent(
      payload,
      signature,
      STRIPE_WEBHOOK_SECRET
    );

    const { type, data } = event;

    // ── find booking by paymentIntentId ───────────────────────────────────
    const booking = await this._bookingRepository.getBookingByPaymentIntentId(
      data.id
    );

    if (!booking) {
      // not our booking — silently acknowledge
      return;
    }

    if (type === "payment_intent.succeeded") {
      await this._handleSuccess(booking, data.metadata);
    } else if (type === "payment_intent.payment_failed") {
      await this._handleFailure(booking);
    }
  }

  // ── success handler ─────────────────────────────────────────────────────
  private async _handleSuccess(
    booking: Awaited<ReturnType<IBookingRepository["getBookingById"]>>,
    metadata: Record<string, string>
  ): Promise<void> {
    if (!booking) return;

    // ── idempotency check ─────────────────────────────────────────────────
    if (booking.status === "confirmed") return;

    // ── confirm booking ───────────────────────────────────────────────────
    await this._bookingRepository.updateBookingStatus(
      booking.id,
      "confirmed",
      booking.paymentIntentId,
      new Date()
    );

    // ── mark all seats as booked + release lock ───────────────────────────
    for (const passenger of booking.passengers) {
      for (const segment of passenger.segments) {
        await this._flightSeatRepository.bookSeat(
          segment.flightSeatId,
          booking.id
        );

        await this._redisService.delete(
          `seat-lock:${segment.flightId}:${segment.flightSeatId}`
        );
      }
    }

    // ── increment offer usageCount if offer was used ──────────────────────
    const offerId = metadata?.offerId;
    if (offerId) {
      await this._offerRepository.incrementUsageCount(offerId);
    }

    // ── clear Redis session keys ──────────────────────────────────────────
    const sessionId = metadata?.sessionId;
    if (sessionId) {
      await Promise.all([
        this._redisService.delete(`booking-segment:${sessionId}`),
        this._redisService.delete(`booking-details:${sessionId}`),
      ]);
    }
     // ── re-fetch confirmed booking for wallet + ticket ────────────────────
    const confirmedBooking = await this._bookingRepository.getBookingById(
      booking.id
    );
    if (!confirmedBooking) return;

    // ── credit provider wallets — wrapped, never breaks webhook ───────────
    try {
      await this._providerWalletService.settleBookingRevenue(confirmedBooking);
    } catch {
      console.error(`Provider wallet credit failed for booking ${booking.id}`);
    }

    // ── generate ticket — wrapped, never breaks webhook ───────────────────
    try {
      await this._ticketGenerationService.generateTicket(confirmedBooking);
    } catch {
      console.error(`Ticket generation failed for booking ${booking.id}`);
    }


    // ── send confirmation email ───────────────────────────────────────────
    await this._sendConfirmationEmail(confirmedBooking);
  }

  // ── failure handler ─────────────────────────────────────────────────────
  private async _handleFailure(
    booking: Awaited<ReturnType<IBookingRepository["getBookingById"]>>
  ): Promise<void> {
    if (!booking) return;

    // ── idempotency check ─────────────────────────────────────────────────
    if (booking.status === "payment_failed") return;

    // ── update booking status ─────────────────────────────────────────────
    await this._bookingRepository.updateBookingStatus(
      booking.id,
      "payment_failed",
      booking.paymentIntentId
    );

    // ── release all seat locks ────────────────────────────────────────────
    for (const passenger of booking.passengers) {
      for (const segment of passenger.segments) {
        await this._flightSeatRepository.unlockSeat(segment.flightSeatId);

        await this._redisService.delete(
          `seat-lock:${segment.flightId}:${segment.flightSeatId}`
        );
      }
    }
  }

  // ── email helper ────────────────────────────────────────────────────────
  private async _sendConfirmationEmail(
    booking: Awaited<ReturnType<IBookingRepository["getBookingById"]>>
  ): Promise<void> {
    if (!booking) return;

    try {
      const user = await this._userRepository.findById(booking.userId);
      if (!user?.email) return;

      const flightSummary = booking.segments
        .map((s) => `${s.from} → ${s.to} (${s.flightNumber})`)
        .join(", ");

      await this._emailService.sendEmail({
        to: user.email,
        subject: "Booking Confirmed — Skylife",
        text: `Hi ${user.firstName ?? "there"},\n\nYour booking has been confirmed.\n\nFlights: ${flightSummary}\nBooking ID: ${booking.id}\nAmount Paid: ₹${booking.grandTotal}\n\nThank you for flying with us.`,
      });
    } catch {
      // email failure must never break the webhook flow
      console.error(`Confirmation email failed for booking ${booking?.id}`);
    }
  }
}