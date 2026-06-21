import { inject, injectable } from "inversify";
import { IBookingRepository } from "@domain/interfaces/IBookingRepository";
import { IOfferRepository } from "@domain/interfaces/IOfferRepository";
import { IFlightSeatRepository } from "@domain/interfaces/IFlightSeatRepository";
import { IRedisService } from "@application/interfaces/service/cache/IRedis.service";
import { IStripeService } from "@application/interfaces/service/payment/IStripe.service";
import { IInitiateBookingUseCase } from "@di/file-imports-index";
import {
  BookingSegmentCacheDTO,
  BookingDetailsCacheDTO,
  InitiateBookingDTO,
  InitiateBookingResponseDTO,
} from "@application/dtos/booking-dtos";
import {
  NotFoundError,
  validationError,
} from "@presentation/middlewares/error.middleware";
import {
  TYPES_BOOKING_REPOSITORIES,
  TYPES_AIRCRAFT_REPOSITORIES,
} from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";
import { BOOKING_MESSAGES } from "@shared/constants/bookingMessages/booking.messages";
import { OFFER_MESSAGES } from "@shared/constants/offerMessages/offer.messages";

const SEAT_LOCK_TTL = 60 * 10;

@injectable()
export class InitiateBookingUseCase implements IInitiateBookingUseCase {
  constructor(
    @inject(TYPES_BOOKING_REPOSITORIES.BookingRepository)
    private readonly _bookingRepository: IBookingRepository,
    @inject(TYPES_BOOKING_REPOSITORIES.OfferRepository)
    private readonly _offerRepository: IOfferRepository,
    @inject(TYPES_AIRCRAFT_REPOSITORIES.FlightSeatRepository)
    private readonly _flightSeatRepository: IFlightSeatRepository,
    @inject(TYPES_SERVICES.RedisService)
    private readonly _redisService: IRedisService,
    @inject(TYPES_SERVICES.StripeService)
    private readonly _stripeService: IStripeService
  ) {}

  async execute(
    userId: string,
    data: InitiateBookingDTO
  ): Promise<InitiateBookingResponseDTO> {
    const { sessionId, offerId } = data;

    if (!sessionId) {
      throw new validationError(BOOKING_MESSAGES.SESSION_ID_REQUIRED);
    }

    // ── load both Redis keys ──────────────────────────────────────────────
    const [segmentCache, detailsCache] = await Promise.all([
      this._redisService.get<BookingSegmentCacheDTO>(
        `booking-segment:${sessionId}`
      ),
      this._redisService.get<BookingDetailsCacheDTO>(
        `booking-details:${sessionId}`
      ),
    ]);

    if (!segmentCache) throw new NotFoundError(BOOKING_MESSAGES.SESSION_NOT_FOUND);
    if (!detailsCache) throw new NotFoundError(BOOKING_MESSAGES.DETAILS_NOT_FOUND);
    if (segmentCache.userId !== userId || detailsCache.userId !== userId) {
      throw new validationError(BOOKING_MESSAGES.SESSION_INVALID);
    }

    // ── validate all seat locks still active ──────────────────────────────
    for (const passenger of detailsCache.passengers) {
      for (const seat of passenger.seats) {
        const lockKey = `seat-lock:${seat.flightId}:${seat.flightSeatId}`;
        const lock = await this._redisService.get<{
          userId: string;
          sessionId: string;
        }>(lockKey);

        if (!lock) {
          throw new validationError(BOOKING_MESSAGES.DETAILS_SEAT_LOCK_EXPIRED);
        }
        if (lock.userId !== userId || lock.sessionId !== sessionId) {
          throw new validationError(BOOKING_MESSAGES.SEAT_NOT_AVAILABLE);
        }
      }
    }

    // ── apply offer if provided ───────────────────────────────────────────
    let discount = 0;
    let grandTotal = detailsCache.fareBreakdown.grandTotal;
    let appliedOfferId: string | undefined;

    if (offerId) {
      const offer = await this._offerRepository.getOfferById(offerId);
      if (!offer) throw new NotFoundError(OFFER_MESSAGES.OFFER_NOT_FOUND);

      const now = new Date();
      const isValid =
        offer.isActive &&
        now >= new Date(offer.validFrom) &&
        now <= new Date(offer.validTo) &&
        grandTotal > offer.minimumAmount &&
        (offer.usageLimit === undefined ||
          offer.usageCount < offer.usageLimit);

      if (!isValid) {
        throw new validationError(OFFER_MESSAGES.OFFER_NOT_ELIGIBLE);
      }

      discount = parseFloat(
        ((grandTotal * offer.discountPercentage) / 100).toFixed(2)
      );
      grandTotal = parseFloat((grandTotal - discount).toFixed(2));
      appliedOfferId = offerId;
    }

    // ── build booking segments ────────────────────────────────────────────
    const bookingSegments = segmentCache.segments.map((s) => ({
      flightId: s.flightId,
      flightNumber: s.flightNumber,
      from: s.from,
      to: s.to,
      departureTime: new Date(s.departureTime),
      arrivalTime: new Date(s.arrivalTime),
    }));

    // ── build passengers — no entity type annotation ──────────────────────
    const passengers = detailsCache.passengers.map((p) => {
      const farePassenger = detailsCache.fareBreakdown.passengerFares.find(
        (pf) => pf.passengerId === p.passengerId
      );

      return {
        passengerId: p.passengerId,
        name: p.name,
        dob: new Date(p.dob),
        gender: p.gender,
        address: p.address,
        mobile: p.mobile,
        extraLuggageKg: p.extraLuggageKg,
        passengerTotal: farePassenger?.passengerTotal ?? 0,
        status: "active" as const,
        segments: p.seats.map((seat) => {
          const segCache = segmentCache.segments.find(
            (s) => s.flightId === seat.flightId
          );
          return {
            flightId: seat.flightId,
            flightNumber: segCache?.flightNumber ?? "",
            providerId: segCache?.providerId ?? "",
            from: segCache?.from ?? "",
            to: segCache?.to ?? "",
            departureTime: new Date(segCache?.departureTime ?? ""),
            arrivalTime: new Date(segCache?.arrivalTime ?? ""),
            flightSeatId: seat.flightSeatId,
            seatNumber: seat.seatNumber,
            cabinClass: seat.cabinClass,
            position: seat.position,
            baseFare: seat.baseFare,
            seatSurcharge: seat.seatSurcharge,
            luggageCharge: seat.luggageCharge,
            segmentFare: seat.segmentFare,
            status: "active" as const,
          };
        }),
      };
    });

    // ── build flight foods — no entity type annotation ────────────────────
    const flightFoods = detailsCache.flightFoods.map((ff) => {
      const segCache = segmentCache.segments.find(
        (s) => s.flightId === ff.flightId
      );
      return {
        flightId: ff.flightId,
        aircraftId: segCache?.aircraftId ?? "",
        providerId: segCache?.providerId ?? "",
        items: ff.items.map((item) => ({
          foodId: item.foodId,
          foodName: item.foodName,
          foodPrice: item.foodPrice,
          quantity: item.quantity,
          itemTotal: item.itemTotal,
        })),
        flightFoodTotal: ff.flightFoodTotal,
      };
    });

    // ── write booking to MongoDB ──────────────────────────────────────────
    const booking = await this._bookingRepository.createBooking({
      userId,
      segments: bookingSegments,
      passengers,
      flightFoods,
      subtotal: detailsCache.fareBreakdown.subtotal,
      discount,
      grandTotal,
      commissionAmount: 0,
      status: "pending",
    });

    // ── lock seats in MongoDB ─────────────────────────────────────────────
    const lockedUntil = new Date(Date.now() + SEAT_LOCK_TTL * 1000);

    for (const passenger of detailsCache.passengers) {
      for (const seat of passenger.seats) {
        await this._flightSeatRepository.lockSeat(
          seat.flightSeatId,
          userId,
          lockedUntil
        );
      }
    }

    // ── create Stripe Payment Intent ──────────────────────────────────────
    const { clientSecret, paymentIntentId } =
      await this._stripeService.createPaymentIntent({
        amount: grandTotal,
        currency: "inr",
        metadata: {
          bookingId: booking.id,
          userId,
          sessionId,
          ...(appliedOfferId && { offerId: appliedOfferId }),
        },
      });

    // ── save paymentIntentId to booking ───────────────────────────────────
    await this._bookingRepository.updateBookingStatus(
      booking.id,
      "pending",
      paymentIntentId
    );

    return {
      bookingId: booking.id,
      clientSecret,
      amount: grandTotal,
    };
  }
}