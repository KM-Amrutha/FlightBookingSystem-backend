// ---------------------------------------------------- PAGE 3-------------------------------------------//
import { inject, injectable } from "inversify";
import { IFlightRepository } from "@domain/interfaces/IFlightRepository";
import { IFlightSeatRepository } from "@domain/interfaces/IFlightSeatRepository";
import { IRedisService } from "@application/interfaces/service/cache/IRedis.service";
import { IGetBookingSeatsMapUseCase } from "@di/file-imports-index";
import {
  BookingSegmentCacheDTO,
  BookingSeatsMapResponseDTO,
  BookingFlightSeatMapDTO,
} from "@application/dtos/booking-dtos";
import { NotFoundError, validationError } from "@presentation/middlewares/error.middleware";
import { TYPES_AIRCRAFT_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";
import { FlightSeatMapper } from "@application/mappers/flightSeatMapper";
// import { IFlightSeat } from "@domain/entities/flightSeat.entity";
import { BOOKING_MESSAGES } from "@shared/constants/bookingMessages/booking.messages";

@injectable()
export class GetBookingSeatsMapUseCase implements IGetBookingSeatsMapUseCase {
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
    sessionId: string
  ): Promise<BookingSeatsMapResponseDTO> {
    if (!sessionId) {
      throw new validationError(BOOKING_MESSAGES.SESSION_ID_REQUIRED);
    }

    // ── load segment cache ────────────────────────────────────────────────
    const cache = await this._redisService.get<BookingSegmentCacheDTO>(
      `booking-segment:${sessionId}`
    );

    if (!cache) {
      throw new NotFoundError(BOOKING_MESSAGES.SESSION_NOT_FOUND);
    }

    if (cache.userId !== userId) {
      throw new validationError(BOOKING_MESSAGES.SESSION_INVALID);
    }

    if (cache.segments.length === 0) {
      throw new validationError(BOOKING_MESSAGES.FLIGHT_NOT_IN_SEGMENT);
    }

    // ── build seat map per flight ─────────────────────────────────────────
    await this._flightSeatRepository.releaseStaleLockes();
    const flights: BookingFlightSeatMapDTO[] = await Promise.all(
      cache.segments.map(async (segment) => {
        const flight = await this._flightRepository.getFlightDetails(
          segment.flightId
        );

        if (!flight) {
          throw new NotFoundError(BOOKING_MESSAGES.FLIGHT_NOT_IN_SEGMENT);
        }

        if (flight.adminApproval.status !== "approved") {
          throw new validationError(BOOKING_MESSAGES.FLIGHT_NOT_AVAILABLE);
        }

        if (flight.flightStatus !== "scheduled") {
          throw new validationError(BOOKING_MESSAGES.FLIGHT_NOT_AVAILABLE);
        }

        // fetch all seats — filter out blocked seats for user
        const allSeats = await this._flightSeatRepository.getFlightSeatsByFlightId(
          segment.flightId
        );

        const visibleSeats = allSeats.filter((seat) => !seat.isBlocked);

        // count available seats — not booked, not locked, not blocked
        const availableSeatCount = visibleSeats.filter(
          (seat) => !seat.isBooked && !seat.isLocked
        ).length;

        // group by cabin class for seat map
       const groupedByCabin = visibleSeats.reduce(
  (acc, seat) => {
    if (!acc[seat.cabinClass]) acc[seat.cabinClass] = [];
    acc[seat.cabinClass]!.push(seat);
    return acc;
  },
  {} as Record<string, typeof visibleSeats>
);

      const seatMap = Object.entries(groupedByCabin).map(
  ([cabinClass, cabinSeats]) => {
    const baseFare = flight.baseFare[cabinClass as keyof typeof flight.baseFare] ?? 0;
    const seatSurcharge = {
      ...(flight.seatSurcharge.window !== undefined && { window: flight.seatSurcharge.window }),
      ...(flight.seatSurcharge.aisle !== undefined && { aisle: flight.seatSurcharge.aisle }),
      ...(flight.seatSurcharge.extraLegroom !== undefined && { extraLegroom: flight.seatSurcharge.extraLegroom }),
    };

    return FlightSeatMapper.toFlightSeatMapDTO(
      cabinSeats,
      flight.id,
      cabinClass,
      baseFare,     
      seatSurcharge 
    );
  }
);

        return {
          flightId: segment.flightId,
          flightNumber: segment.flightNumber,
          from: segment.from,
          to: segment.to,
          departureTime: segment.departureTime,
          arrivalTime: segment.arrivalTime,
          availableSeatCount,
          hasWarning: availableSeatCount < cache.passengerCount,
          seatMap,
        };
      })
    );

    return {
      sessionId,
      passengerCount: cache.passengerCount,
      flights,
    };
  }
}