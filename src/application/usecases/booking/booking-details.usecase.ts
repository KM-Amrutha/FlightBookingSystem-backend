// ---------------------------------------------------- PAGE 3-------------------------------------------//
import { inject, injectable } from "inversify";
import { IFlightRepository } from "@domain/interfaces/IFlightRepository";
import { IFlightSeatRepository } from "@domain/interfaces/IFlightSeatRepository";
import { IFoodRepository } from "@domain/interfaces/IFoodRepository";
import { IRedisService } from "@application/interfaces/service/cache/IRedis.service";
import { IBookingDetailsUseCase } from "@di/file-imports-index";
import {
  BookingSegmentCacheDTO,
  BookingDetailsCacheDTO,
  BookingDetailsPassengerDTO,
  BookingDetailsPassengerSeatDTO,
  BookingDetailsFlightFoodDTO,
  BookingFareBreakdownDTO,
  BookingFareBreakdownPassengerDTO,
  BookingFareBreakdownSegmentDTO,
  SaveBookingDetailsDTO,
} from "@application/dtos/booking-dtos";
import {
  NotFoundError,
  validationError,
} from "@presentation/middlewares/error.middleware";
import { TYPES_AIRCRAFT_REPOSITORIES, TYPES_BOOKING_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";
import { BOOKING_MESSAGES } from "@shared/constants/bookingMessages/booking.messages";
import { FOOD_MESSAGES } from "@shared/constants/foodMessages/food.messages";
import {FLIGHT_MESSAGES} from "@shared/constants/flightMessages/flight.messges"
import { IFlightSeat } from "@domain/entities/flightSeat.entity";

const BOOKING_DETAILS_TTL = 60 * 30; // 30 minutes

@injectable()
export class BookingDetailsUseCase implements IBookingDetailsUseCase {
  constructor(
    @inject(TYPES_SERVICES.RedisService)
    private _redisService: IRedisService,
    @inject(TYPES_AIRCRAFT_REPOSITORIES.FlightRepository)
    private _flightRepository: IFlightRepository,
    @inject(TYPES_AIRCRAFT_REPOSITORIES.FlightSeatRepository)
    private _flightSeatRepository: IFlightSeatRepository,
    @inject(TYPES_BOOKING_REPOSITORIES.FoodRepository)
    private _foodRepository: IFoodRepository
  ) {}

  async execute(
    userId: string,
    sessionId: string,
    data: SaveBookingDetailsDTO
  ): Promise<BookingDetailsCacheDTO> {

    // ── validate session ──────────────────────────────────────────────────
    if (!sessionId) {
      throw new validationError(BOOKING_MESSAGES.SESSION_ID_REQUIRED);
    }

    const cache = await this._redisService.get<BookingSegmentCacheDTO>(
      `booking-segment:${sessionId}`
    );
    if (!cache) {
      throw new NotFoundError(BOOKING_MESSAGES.SESSION_NOT_FOUND);
    }
    if (cache.userId !== userId) {
      throw new validationError(BOOKING_MESSAGES.SESSION_INVALID);
    }

    // ── validate passenger count matches ──────────────────────────────────
    if (data.passengers.length !== cache.passengerCount) {
      throw new validationError(BOOKING_MESSAGES.DETAILS_INVALID_PASSENGER);
    }

    // ── fetch all flights ─────────────────────────────────────────────────
    const flights = await Promise.all(
      cache.segments.map(async (segment) => {
        const flight = await this._flightRepository.getFlightDetails(
          segment.flightId
        );
        if (!flight) throw new NotFoundError(FLIGHT_MESSAGES.NOT_FOUND);
        if (flight.adminApproval.status !== "approved") {
          throw new validationError(BOOKING_MESSAGES.FLIGHT_NOT_AVAILABLE);
        }
        if (flight.flightStatus !== "scheduled") {
          throw new validationError(BOOKING_MESSAGES.FLIGHT_NOT_AVAILABLE);
        }
        return flight;
      })
    );

    const flightMap = new Map(flights.map((f) => [f.id, f]));

    // ── validate all seat locks + fetch seat details ───────────────────────
    const seatMap = new Map<string, IFlightSeat>();

    for (const passenger of data.passengers) {
      for (const seatSelection of passenger.seats) {
        const lockKey = `seat-lock:${seatSelection.flightId}:${seatSelection.flightSeatId}`;
        const lock = await this._redisService.get<{ userId: string; sessionId: string }>(
          lockKey
        );

        if (!lock) {
          throw new validationError(BOOKING_MESSAGES.DETAILS_SEAT_LOCK_EXPIRED);
        }
        if (lock.userId !== userId || lock.sessionId !== sessionId) {
          throw new validationError(BOOKING_MESSAGES.SEAT_NOT_AVAILABLE);
        }

        const seat = await this._flightSeatRepository.getFlightSeatById(
          seatSelection.flightSeatId
        );
        if (!seat) throw new NotFoundError(BOOKING_MESSAGES.SEAT_NOT_FOUND);

        seatMap.set(
          `${seatSelection.flightId}:${seatSelection.flightSeatId}`,
          seat
        );
      }
    }

    // ── validate and fetch food items ─────────────────────────────────────
    const flightFoods: BookingDetailsFlightFoodDTO[] = [];

    for (const flightFood of data.flightFoods) {
      if (!flightFood.items || flightFood.items.length === 0) continue;

      const flight = flightMap.get(flightFood.flightId);
      if (!flight) throw new NotFoundError(FLIGHT_MESSAGES.NOT_FOUND);

      let flightFoodTotal = 0;
      const resolvedItems: BookingDetailsFlightFoodDTO["items"] = [];

      for (const item of flightFood.items) {
        if (item.quantity < 1) continue;

        const food = await this._foodRepository.getFoodById(item.foodId);
        if (!food) throw new NotFoundError(FOOD_MESSAGES.FOOD_NOT_FOUND);
        if (!food.isActive) continue;

        const itemTotal = food.isComplimentary
          ? 0
          : food.foodPrice * item.quantity;

        flightFoodTotal += itemTotal;
        resolvedItems.push({
          foodId: food.id,
          foodName: food.foodName,
          foodPrice: food.isComplimentary ? 0 : food.foodPrice,
          quantity: item.quantity,
          itemTotal,
        });
      }

      if (resolvedItems.length > 0) {
        flightFoods.push({
          flightId: flightFood.flightId,
          items: resolvedItems,
          flightFoodTotal,
        });
      }
    }

    // ── calculate fare per passenger ──────────────────────────────────────
    const passengers: BookingDetailsPassengerDTO[] = [];
    const fareBreakdownPassengers: BookingFareBreakdownPassengerDTO[] = [];
    let grandPassengerTotal = 0;

    for (const passenger of data.passengers) {
      const passengerSeats: BookingDetailsPassengerSeatDTO[] = [];
      const perSegment: BookingFareBreakdownSegmentDTO[] = [];
      let passengerTotal = 0;

      for (const seatSelection of passenger.seats) {
        const flight = flightMap.get(seatSelection.flightId);
        if (!flight) throw new NotFoundError(FLIGHT_MESSAGES.NOT_FOUND);

        const seat = seatMap.get(
          `${seatSelection.flightId}:${seatSelection.flightSeatId}`
        );
        if (!seat) throw new NotFoundError(BOOKING_MESSAGES.SEAT_NOT_FOUND);

        const segmentCache = cache.segments.find(
          (s) => s.flightId === seatSelection.flightId
        );

        // ── fare calculation ──────────────────────────────────────────────
        const baseFare =
          flight.baseFare[seat.cabinClass as keyof typeof flight.baseFare] ?? 0;

        const seatSurcharge =
          flight.seatSurcharge[
            seat.position as keyof typeof flight.seatSurcharge
          ] ?? 0;

          const extraChargePerKg =
  flight.baggageRules?.extraChargePerKg ?? 0;

const maxExtraKg =
  flight.baggageRules?.maxExtraKg ?? Infinity;

const chargeableKg = Math.min(
  passenger.extraLuggageKg,
  maxExtraKg
);

const luggageCharge =
  chargeableKg * extraChargePerKg;

        const segmentFare = baseFare + seatSurcharge + luggageCharge;
        passengerTotal += segmentFare;

        passengerSeats.push({
          flightId: seatSelection.flightId,
          flightSeatId: seatSelection.flightSeatId,
          seatNumber: seat.seatNumber,
          cabinClass: seat.cabinClass,
          position: seat.position,
          baseFare,
          seatSurcharge,
          luggageCharge,
          segmentFare,
        });

        perSegment.push({
          flightId: seatSelection.flightId,
          flightNumber: segmentCache?.flightNumber ?? "",
          from: segmentCache?.from ?? "",
          to: segmentCache?.to ?? "",
          seatNumber: seat.seatNumber,
          cabinClass: seat.cabinClass,
          baseFare,
          seatSurcharge,
          luggageCharge,
          segmentFare,
        });
      }

      grandPassengerTotal += passengerTotal;

      passengers.push({
        passengerId: passenger.passengerId,
        name: passenger.name,
        dob: passenger.dob,
        gender: passenger.gender,
        address: passenger.address,
        mobile: passenger.mobile,
        extraLuggageKg: passenger.extraLuggageKg,
        seats: passengerSeats,
      });

      fareBreakdownPassengers.push({
        passengerId: passenger.passengerId,
        passengerName: passenger.name,
        perSegment,
        passengerTotal,
      });
    }

    // ── calculate food total ──────────────────────────────────────────────
    const foodTotal = flightFoods.reduce(
      (sum, f) => sum + f.flightFoodTotal,
      0
    );

    const subtotal = grandPassengerTotal;

    const fareBreakdown: BookingFareBreakdownDTO = {
      passengerFares: fareBreakdownPassengers,
      foodTotal,
      subtotal,
      discount: 0,
      grandTotal: subtotal+foodTotal,
    };

    // ── build and save booking details cache ──────────────────────────────
    const bookingDetailsCache: BookingDetailsCacheDTO = {
      sessionId,
      userId,
      passengers,
      flightFoods,
      fareBreakdown,
      createdAt: new Date().toISOString(),
    };

    await this._redisService.set(
      `booking-details:${sessionId}`,
      bookingDetailsCache,
      BOOKING_DETAILS_TTL
    );
      console.log('bookindetailsCache: ', bookingDetailsCache)
    return bookingDetailsCache;
  }
}