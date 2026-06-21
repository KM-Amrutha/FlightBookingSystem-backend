import { inject, injectable } from "inversify";
import { IBookingRepository } from "@domain/interfaces/IBookingRepository";
import { IFlightSeatRepository } from "@domain/interfaces/IFlightSeatRepository";
import { IRedisService } from "@application/interfaces/service/cache/IRedis.service";
import { IStripeService } from "@application/interfaces/service/payment/IStripe.service";
import { IRetryPaymentUseCase } from "@di/file-imports-index";
import { RetryPaymentResponseDTO } from "@application/dtos/booking-dtos";
import {
  NotFoundError,
  validationError,
  ForbiddenError,
} from "@presentation/middlewares/error.middleware";
import {
  TYPES_BOOKING_REPOSITORIES,
  TYPES_AIRCRAFT_REPOSITORIES,
} from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";
import { BOOKING_MESSAGES } from "@shared/constants/bookingMessages/booking.messages";

const RETRY_WINDOW_MS = 30 * 60 * 1000;
const SEAT_LOCK_TTL = 60 * 10;

@injectable()
export class RetryPaymentUseCase implements IRetryPaymentUseCase {
  constructor(
    @inject(TYPES_BOOKING_REPOSITORIES.BookingRepository)
    private readonly _bookingRepository: IBookingRepository,
    @inject(TYPES_AIRCRAFT_REPOSITORIES.FlightSeatRepository)
    private readonly _flightSeatRepository: IFlightSeatRepository,
    @inject(TYPES_SERVICES.RedisService)
    private readonly _redisService: IRedisService,
    @inject(TYPES_SERVICES.StripeService)
    private readonly _stripeService: IStripeService
  ) {}

  async execute(
    userId: string,
    bookingId: string
  ): Promise<RetryPaymentResponseDTO> {
    if (!bookingId) {
      throw new validationError(BOOKING_MESSAGES.BOOKING_ID_REQUIRED);
    }

    const booking = await this._bookingRepository.getBookingById(bookingId);
    if (!booking) throw new NotFoundError(BOOKING_MESSAGES.BOOKING_NOT_FOUND);
    if (booking.userId.toString() !== userId.toString()) {
  throw new ForbiddenError(BOOKING_MESSAGES.SESSION_INVALID);
}
    if (booking.status !== "payment_failed") {
      throw new validationError(BOOKING_MESSAGES.RETRY_NOT_ALLOWED);
    }

    // ── check 30 minute retry window ──────────────────────────────────────
    const createdAt = new Date(booking.createdAt);
    const now = new Date();
    if (now.getTime() - createdAt.getTime() > RETRY_WINDOW_MS) {
      throw new validationError(BOOKING_MESSAGES.RETRY_WINDOW_EXPIRED);
    }

    // ── re-lock all seats — validate still available ───────────────────────
    const lockedUntil = new Date(Date.now() + SEAT_LOCK_TTL * 1000);

    for (const passenger of booking.passengers) {
      for (const segment of passenger.segments) {
        const isAvailable = await this._flightSeatRepository.isSeatAvailable(
          segment.flightSeatId
        );
        if (!isAvailable) {
          throw new validationError(BOOKING_MESSAGES.SEAT_NOT_AVAILABLE);
        }

        // re-lock in MongoDB
        await this._flightSeatRepository.lockSeat(
          segment.flightSeatId,
          userId,
          lockedUntil
        );

        // re-lock in Redis
        const lockKey = `seat-lock:${segment.flightId}:${segment.flightSeatId}`;
        await this._redisService.set(
          lockKey,
          { userId, sessionId: bookingId },
          SEAT_LOCK_TTL
        );
      }
    }

    // ── create new Stripe Payment Intent ──────────────────────────────────
    const { clientSecret, paymentIntentId } =
      await this._stripeService.createPaymentIntent({
        amount: booking.grandTotal,
        currency: "inr",
        metadata: {
          bookingId: booking.id,
          userId,
        },
      });

    // ── update booking with new paymentIntentId ───────────────────────────
    await this._bookingRepository.updateBookingStatus(
      bookingId,
      "pending",
      paymentIntentId
    );

    return {
      bookingId: booking.id,
      clientSecret,
      amount: booking.grandTotal,
    };
  }
}