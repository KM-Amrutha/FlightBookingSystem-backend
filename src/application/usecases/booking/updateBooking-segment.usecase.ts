// ---------------------------------------------------- PAGE 2--------------------------------------------//
import { inject, injectable } from "inversify";
import { IRedisService } from "@application/interfaces/service/cache/IRedis.service";
import { IUpdateBookingSegmentUseCase } from "@di/file-imports-index";
import {
  BookingSegmentCacheDTO,
  BookingSegmentResponseDTO,
  UpdateBookingSegmentDTO,
} from "@application/dtos/booking-dtos";
import { NotFoundError, validationError } from "@presentation/middlewares/error.middleware";
import { TYPES_SERVICES } from "@di/types-services";
import { BookingCacheMapper } from "@application/mappers/bookingCacheMapper";
import {BOOKING_MESSAGES}  from "@shared/constants/bookingMessages/booking.messages"

const BOOKING_SEGMENT_TTL = 60 * 30; // 30 minutes

@injectable()
export class UpdateBookingSegmentUseCase implements IUpdateBookingSegmentUseCase {
  constructor(
    @inject(TYPES_SERVICES.RedisService)
    private _redisService: IRedisService
  ) {}

  async execute(
    userId: string,
    sessionId: string,
    data: UpdateBookingSegmentDTO
  ): Promise<BookingSegmentResponseDTO|null> {
    if (!sessionId) {
      throw new validationError(BOOKING_MESSAGES.SESSION_ID_REQUIRED);
    }

    if (!data.passengerCount && !data.removeFlightId) {
      throw new validationError("Nothing to update");
    }

    // ── load cache ────────────────────────────────────────────────────────
    const cache = await this._redisService.get<BookingSegmentCacheDTO>(
      `booking-segment:${sessionId}`
    );

    if (!cache) {
      throw new NotFoundError(BOOKING_MESSAGES.SESSION_NOT_FOUND);
    }

    if (cache.userId !== userId) {
      throw new validationError(BOOKING_MESSAGES.SESSION_INVALID);
    }

    // ── remove flight ─────────────────────────────────────────────────────
    if (data.removeFlightId) {
      const flightExists = cache.segments.some(
        (s) => s.flightId === data.removeFlightId
      );
      if (!flightExists) {
        throw new NotFoundError(BOOKING_MESSAGES.FLIGHT_NOT_IN_SEGMENT);
      }
      cache.segments = cache.segments.filter(
        (s) => s.flightId !== data.removeFlightId
      );
    }

    // ── update passenger count ────────────────────────────────────────────
    if (data.passengerCount !== undefined) {
      if (data.passengerCount < 1) {
        throw new validationError(BOOKING_MESSAGES.PASSENGER_COUNT_REQUIRED);
      }
      if (data.passengerCount > 9) {
        throw new validationError(BOOKING_MESSAGES.PASSENGER_COUNT_MAX);
      }
      cache.passengerCount = data.passengerCount;
    }

    // ── validate segment still has flights ────────────────────────────────
   if (cache.segments.length === 0) {
  await this._redisService.delete(`booking-segment:${sessionId}`);
  return null;
}

    // ── save updated cache ────────────────────────────────────────────────
    await this._redisService.set(
      `booking-segment:${sessionId}`,
      cache,
      BOOKING_SEGMENT_TTL
    );

    return BookingCacheMapper.toBookingSegmentResponseDTO(cache);
  }
}