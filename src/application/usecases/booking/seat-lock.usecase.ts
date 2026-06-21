// ---------------------------------------------------- PAGE 3--------------------------------------------//
import { inject, injectable } from "inversify";
import { IFlightRepository } from "@domain/interfaces/IFlightRepository";
import { IFlightSeatRepository } from "@domain/interfaces/IFlightSeatRepository";
import { IRedisService } from "@application/interfaces/service/cache/IRedis.service";
import { ISeatLockUseCase } from "@di/file-imports-index";
import {
  BookingSegmentCacheDTO,
  SeatLockDTO,
  SeatLockResponseDTO,
} from "@application/dtos/booking-dtos";
import {
  NotFoundError,
  validationError,
} from "@presentation/middlewares/error.middleware";
import { TYPES_AIRCRAFT_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";
import { BOOKING_MESSAGES } from "@shared/constants/bookingMessages/booking.messages";
import {FLIGHT_MESSAGES} from "@shared/constants/flightMessages/flight.messges"

const SEAT_LOCK_TTL = 60 * 10; // 10 minutes

@injectable()
export class SeatLockUseCase implements ISeatLockUseCase {
  constructor(
    @inject(TYPES_SERVICES.RedisService)
    private _redisService: IRedisService,
    @inject(TYPES_AIRCRAFT_REPOSITORIES.FlightRepository)
    private _flightRepository: IFlightRepository,
    @inject(TYPES_AIRCRAFT_REPOSITORIES.FlightSeatRepository)
    private _flightSeatRepository: IFlightSeatRepository
  ) {}

  async execute(
    userId: string,
    sessionId: string,
    data: SeatLockDTO
  ): Promise<SeatLockResponseDTO> {
    const { flightId, flightSeatId, passengerId } = data;

    // ── validate input ────────────────────────────────────────────────────
    if (!sessionId) {
      throw new validationError(BOOKING_MESSAGES.SESSION_ID_REQUIRED);
    }
    if (!flightId || !flightSeatId || !passengerId) {
      throw new validationError(BOOKING_MESSAGES.SEAT_ID_REQUIRED);
    }

    // ── validate session ──────────────────────────────────────────────────
    const cache = await this._redisService.get<BookingSegmentCacheDTO>(
      `booking-segment:${sessionId}`
    );
    if (!cache) {
      throw new NotFoundError(BOOKING_MESSAGES.SESSION_NOT_FOUND);
    }
    if (cache.userId !== userId) {
      throw new validationError(BOOKING_MESSAGES.SESSION_INVALID);
    }

    // ── validate flight is in segment ─────────────────────────────────────
    const segmentFlight = cache.segments.find((s) => s.flightId === flightId);
    if (!segmentFlight) {
      throw new validationError(BOOKING_MESSAGES.FLIGHT_NOT_IN_SEGMENT);
    }

    // ── validate flight ───────────────────────────────────────────────────
    const flight = await this._flightRepository.getFlightDetails(flightId);
    if (!flight) {
      throw new NotFoundError(FLIGHT_MESSAGES.NOT_FOUND);
    }
    if (flight.adminApproval.status !== "approved") {
      throw new validationError(BOOKING_MESSAGES.FLIGHT_NOT_AVAILABLE);
    }
    if (flight.flightStatus !== "scheduled") {
      throw new validationError(BOOKING_MESSAGES.FLIGHT_NOT_AVAILABLE);
    }

    // ── validate seat ─────────────────────────────────────────────────────
    const seat = await this._flightSeatRepository.getFlightSeatById(flightSeatId);
    if (!seat) {
      throw new NotFoundError(BOOKING_MESSAGES.SEAT_NOT_FOUND);
    }
    if (seat.isBooked || seat.isBlocked || seat.isLocked) {
      throw new validationError(BOOKING_MESSAGES.SEAT_NOT_AVAILABLE);
    }

    // ── check if this passenger already has a seat locked for this flight ─
    const existingLockKey = `seat-lock:${flightId}:${userId}:${passengerId}`;
    const existingLock = await this._redisService.get<{ flightSeatId: string }>(
      existingLockKey
    );

    // ── release previous lock if passenger is changing seat ───────────────
    if (existingLock) {
      await Promise.all([
        this._flightSeatRepository.unlockSeat(existingLock.flightSeatId),
        this._redisService.delete(existingLockKey),
        this._redisService.delete(
          `seat-lock:${flightId}:${existingLock.flightSeatId}`
        ),
      ]);
    }

    // ── lock seat in MongoDB ──────────────────────────────────────────────
    const lockedUntil = new Date(Date.now() + SEAT_LOCK_TTL * 1000);
    const lockedSeat = await this._flightSeatRepository.lockSeat(
      flightSeatId,
      userId,
      lockedUntil
    );

    if (!lockedSeat) {
      throw new validationError(BOOKING_MESSAGES.SEAT_ALREADY_LOCKED);
    }

    // ── save lock in Redis ────────────────────────────────────────────────
    // Key 1: seat-lock:<flightId>:<flightSeatId> — to check if seat is locked
    await this._redisService.set(
      `seat-lock:${flightId}:${flightSeatId}`,
      { userId, sessionId },
      SEAT_LOCK_TTL
    );

    // Key 2: seat-lock:<flightId>:<userId>:<passengerId> — to find previous lock when passenger changes seat
    await this._redisService.set(
      `seat-lock:${flightId}:${userId}:${passengerId}`,
      { flightSeatId },
      SEAT_LOCK_TTL
    );

    return {
      flightSeatId,
      seatNumber: lockedSeat.seatNumber,
      flightId,
      passengerId,
      lockedUntil: lockedUntil.toISOString(),
    };
  }
}