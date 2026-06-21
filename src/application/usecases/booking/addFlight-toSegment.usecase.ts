// ---------------------------------------------------- PAGE 1--------------------------------------------//
import { inject, injectable } from "inversify";
import { v4 as uuidv4 } from "uuid";
import { IFlightRepository,
  IProviderRepository,
IAircraftRepository } from "@di/file-imports-index"; 
import { IRedisService } from "@application/interfaces/service/cache/IRedis.service";
import { IAddFlightToSegmentUseCase } from "@di/file-imports-index";
import {
  AddFlightToSegmentDTO,
  BookingSegmentCacheDTO,
  BookingSegmentResponseDTO,
} from "@application/dtos/booking-dtos";
import { NotFoundError, validationError } from "@presentation/middlewares/error.middleware";
import { TYPES_AIRCRAFT_REPOSITORIES,TYPES_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";

import {BookingMapper} from "@application/mappers/bookingMapper";
import { BookingCacheMapper } from "@application/mappers/bookingCacheMapper";
import {BOOKING_MESSAGES} from "@shared/constants/bookingMessages/booking.messages"
import {FLIGHT_MESSAGES} from "@shared/constants/flightMessages/flight.messges"


const BOOKING_SEGMENT_TTL = 60 * 30; // 30 minutes
const MAX_FLIGHTS_PER_SEGMENT = 3;   // direct + max 2 stops

@injectable()
export class AddFlightToSegmentUseCase implements IAddFlightToSegmentUseCase {
  constructor(
    @inject(TYPES_AIRCRAFT_REPOSITORIES.FlightRepository)
    private _flightRepository: IFlightRepository,
    @inject(TYPES_SERVICES.RedisService)
    private _redisService: IRedisService,
    @inject(TYPES_REPOSITORIES.ProviderRepository)
    private _providerRepository: IProviderRepository,
    @inject(TYPES_AIRCRAFT_REPOSITORIES.AircraftRepository)
    private _aircraftRepository: IAircraftRepository,
  ) {}

  async execute(
    userId: string,
    data: AddFlightToSegmentDTO
  ): Promise<BookingSegmentResponseDTO> {
    const { flightId, passengerCount, sessionId } = data;
    

    // ── validate input ────────────────────────────────────────────────────
    if (!flightId) {
      throw new validationError(FLIGHT_MESSAGES.ID_REQUIRED);
    }
    if (!passengerCount || passengerCount < 1) {
      throw new validationError(BOOKING_MESSAGES.PASSENGER_COUNT_REQUIRED);
    }
    if (passengerCount > 9) {
      throw new validationError(BOOKING_MESSAGES.PASSENGER_COUNT_MAX);
    }
    
    // ── validate flight ───────────────────────────────────────────────────
    const flight = await this._flightRepository.getFlightDetails(flightId);
    console.log("flight amenities:", flight?.amenities);
    if (!flight) {
      throw new NotFoundError(FLIGHT_MESSAGES.NOT_FOUND);
    }
    if (flight.adminApproval.status !== "approved") {
      throw new validationError(BOOKING_MESSAGES.FLIGHT_NOT_AVAILABLE);
    }
    if (flight.flightStatus !== "scheduled") {
      throw new validationError(BOOKING_MESSAGES.FLIGHT_NOT_AVAILABLE);
    }
    // ── check departure time is in future ─────────────────────────────────
    if (new Date(flight.departureTime) <= new Date()) {
      throw new validationError(BOOKING_MESSAGES.FLIGHT_ALREADY_DEPARTED);
    }

    // fetch provider + aircraft in parallel
const [provider, aircraft] = await Promise.all([
  this._providerRepository.getProviderDetailsById(flight.providerId),
  this._aircraftRepository.getAircraftById(flight.aircraftId),  
]);

const providerName = provider?.companyName ?? "";
const providerLogo = provider?.logoUrl ?? undefined;
const manufacturer = aircraft?.manufacturer ?? "";            
   
    // ── load or create segment cache ──────────────────────────────────────
    let cache: BookingSegmentCacheDTO | null = null;

    if (sessionId) {
      cache = await this._redisService.get<BookingSegmentCacheDTO>(
        `booking-segment:${sessionId}`
      );
      if (!cache) {
        throw new NotFoundError(BOOKING_MESSAGES.SESSION_NOT_FOUND);
      }
      if (cache.userId !== userId) {
        throw new validationError(BOOKING_MESSAGES.SESSION_INVALID);
      }
    }

    // ── build segment flight DTO via mapper ───────────────────────────────
    const segmentFlight = BookingMapper.toBookingSegmentFlightDTO(
      flight,providerName,providerLogo, manufacturer);

    if (cache) {
      // ── existing session — add flight ─────────────────────────────────
      const alreadyAdded = cache.segments.some((s) => s.flightId === flightId);
      if (alreadyAdded) {
        throw new validationError(BOOKING_MESSAGES.FLIGHT_ALREADY_IN_SEGMENT);
      }
      if (cache.segments.length >= MAX_FLIGHTS_PER_SEGMENT) {
        throw new validationError(
          BOOKING_MESSAGES.FLIGHT_MAX_SEGMENTS
        );
      }

      cache.segments.push(segmentFlight);
      cache.passengerCount = passengerCount;
    } else {
      // ── new session ───────────────────────────────────────────────────
      const newSessionId = uuidv4();
      cache = {
        sessionId: newSessionId,
        userId,
        passengerCount,
        segments: [segmentFlight],
        createdAt: new Date().toISOString(),
      };
    }

    // ── save to Redis ─────────────────────────────────────────────────────
    await this._redisService.set(
      `booking-segment:${cache.sessionId}`,
      cache,
      BOOKING_SEGMENT_TTL
    );

    return BookingCacheMapper.toBookingSegmentResponseDTO(cache);
  }
}