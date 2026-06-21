import { injectable, inject } from "inversify";
import {
  TYPES_REPOSITORIES,
  TYPES_AIRCRAFT_REPOSITORIES,
  TYPES_BOOKING_REPOSITORIES,
} from "@di/types-repositories";
import {
  IFlightRepository,
  IDestinationRepository,
  IProviderRepository,
  IBookingRepository,
} from "@di/file-imports-index";
import { IUpdateFlightUseCase } from "@di/file-imports-index";
import { UpdateFlightDTO, FlightDetailsDTO } from "@application/dtos/flight-dtos";
import { validationError, NotFoundError, ForbiddenError } from "@presentation/middlewares/error.middleware";
import { AUTH_MESSAGES, FLIGHT_MESSAGES, PROVIDER_MESSAGES } from "@shared/constants/index.constants";
import { FlightMapper } from "@application/mappers/flightMapper";

@injectable()
export class UpdateFlightUseCase implements IUpdateFlightUseCase {
  constructor(
    @inject(TYPES_AIRCRAFT_REPOSITORIES.FlightRepository)
    private readonly _flightRepository: IFlightRepository,
    @inject(TYPES_AIRCRAFT_REPOSITORIES.DestionationRepository)
    private readonly _destinationRepository: IDestinationRepository,
    @inject(TYPES_REPOSITORIES.ProviderRepository)
    private readonly _providerRepository: IProviderRepository,
    @inject(TYPES_BOOKING_REPOSITORIES.BookingRepository)
    private readonly _bookingRepository: IBookingRepository
  ) {}

  async execute(
    providerId: string,
    flightId: string,
    data: UpdateFlightDTO
  ): Promise<FlightDetailsDTO> {

    if (!providerId || !flightId) {
      throw new validationError(FLIGHT_MESSAGES.PROVIDER_ID_REQUIRED);
    }

    const flight = await this._flightRepository.getFlightDetails(flightId);
    if (!flight) throw new NotFoundError(FLIGHT_MESSAGES.NOT_FOUND);
    if (flight.providerId !== providerId) throw new ForbiddenError(FLIGHT_MESSAGES.AIRCRAFT_OWNERSHIP_INVALID);

    if (flight.flightStatus !== "scheduled") {
      throw new validationError(FLIGHT_MESSAGES.ONLY_SCHEDULED_CAN_EDIT);
    }

    if (new Date(flight.departureTime) <= new Date()) {
      throw new validationError(FLIGHT_MESSAGES.ALREADY_DEPARTED);
    }

   if (flight.flightType === "return") {
  if (
    data.departureTime !== undefined ||
    data.durationMinutes !== undefined ||
    data.bufferMinutes !== undefined ||
    data.arrivalDestinationId !== undefined
  ) {
    throw new validationError(
      FLIGHT_MESSAGES.RETURN_CANNOT_EDIT
    );
  }
}

    if (flight.flightType === "recurring") {
      if (data.durationMinutes !== undefined) {
        throw new validationError(FLIGHT_MESSAGES.RECURRING_DURATION_CANNOT_EDIT);
      }
      if (data.arrivalDestinationId !== undefined) {
        throw new validationError(FLIGHT_MESSAGES.RECURRING_ARRIVAL_CANNOT_EDIT);
      }
      
    }

    const [provider, isBlocked] = await Promise.all([
      this._providerRepository.getProviderDetailsById(providerId),
      this._providerRepository.isProviderBlocked(providerId),
    ]);

    if (!provider) throw new NotFoundError(PROVIDER_MESSAGES.PROVIDER_NOT_FOUND);
    if (isBlocked) throw new ForbiddenError(AUTH_MESSAGES.ACCOUNT_BLOCKED);
    if (!provider.isVerified) throw new ForbiddenError(AUTH_MESSAGES.ACCOUNT_NOT_VERIFIED);

    if (
      data.durationMinutes !== undefined &&
      (data.durationMinutes < 30 || data.durationMinutes > 1440)
    ) {
      throw new validationError(FLIGHT_MESSAGES.INVALID_DURATION);
    }

    if (data.baseFare?.economy !== undefined && data.baseFare.economy <= 0) {
      throw new validationError(FLIGHT_MESSAGES.INVALID_BASE_FARE);
    }

    if (data.bufferMinutes !== undefined && (data.bufferMinutes < 30 || data.bufferMinutes > 720)) {
      throw new validationError(FLIGHT_MESSAGES.BUFFER_INVALID);
    }

    // ── departure time OR buffer change logic ──────────────────────────────
    let newDepartureTime: Date | undefined;
    let newArrivalTime: Date | undefined;

    if (data.departureTime !== undefined || data.bufferMinutes !== undefined) {
      const hasBookings = await this._bookingRepository.hasConfirmedBookingsForFlight(flightId);
      if (hasBookings) {
        throw new validationError(FLIGHT_MESSAGES.HAS_CONFIRMED_BOOKINGS);
      }

      newDepartureTime = data.departureTime
        ? new Date(data.departureTime)
        : new Date(flight.departureTime);

      if (data.departureTime !== undefined) {
        if (isNaN(newDepartureTime.getTime())) {
          throw new validationError(FLIGHT_MESSAGES.INVALID_TIME);
        }
        if (newDepartureTime <= new Date()) {
          throw new validationError(FLIGHT_MESSAGES.DEPARTURE_MUST_BE_FUTURE);
        }
      }

      const durationMinutes = data.durationMinutes ?? flight.durationMinutes;
      const bufferMinutes = data.bufferMinutes ?? flight.bufferMinutes ?? 60;

      newArrivalTime = new Date(newDepartureTime.getTime() + durationMinutes * 60 * 1000);

      // ── conflict check — exclude self + paired return ──────────────────
      const existingFlights = await this._flightRepository.getActiveFlightsForAircraft(flight.aircraftId);
      const returnFlight = await this._flightRepository.getReturnFlightByParentId(flightId);

      const flightsToCheck = existingFlights.filter(
        (f) => f.id !== flightId && f.id !== returnFlight?.id
      );

      const newWindowEnd = new Date(
        newDepartureTime.getTime() +
          (durationMinutes + bufferMinutes + durationMinutes + bufferMinutes) * 60 * 1000
      );

      const hasConflict = flightsToCheck
        .filter((f) => f.flightType === "outbound" || f.flightType === "recurring")
        .some((f) => {
          const existingBuffer = f.bufferMinutes ?? bufferMinutes;
          const existingStart = new Date(f.departureTime);
          const existingEnd = new Date(
            existingStart.getTime() +
              (f.durationMinutes + existingBuffer + f.durationMinutes + existingBuffer) * 60 * 1000
          );
          return newDepartureTime! < existingEnd && existingStart < newWindowEnd;
        });

      if (hasConflict) {
        throw new validationError(FLIGHT_MESSAGES.NOT_AVAILABLE_THIS_TIME);
      }

      // ── auto-update return flight ──────────────────────────────────────
      if (returnFlight) {
        const returnDepartureTime = new Date(newArrivalTime.getTime() + bufferMinutes * 60 * 1000);
        const returnArrivalTime = new Date(returnDepartureTime.getTime() + durationMinutes * 60 * 1000);
        await this._flightRepository.updateReturnFlight(
          flightId,
          returnDepartureTime,
          returnArrivalTime
        );
      }
    }

    // ── recalculate arrival if duration or destination changes ─────────────
    let calculatedArrivalTime: Date | undefined;

    const needsRecalculation =
      data.durationMinutes !== undefined || data.arrivalDestinationId !== undefined;

    if (needsRecalculation && !newArrivalTime) {
      const arrDestId = data.arrivalDestinationId || flight.arrivalDestinationId;
      const arrDest = await this._destinationRepository.findById(arrDestId);
      if (!arrDest) throw new NotFoundError(FLIGHT_MESSAGES.INVALID_DESTINATION);

      const departureUtc = new Date(flight.departureTime);
      const durationMinutes = data.durationMinutes ?? flight.durationMinutes;
      calculatedArrivalTime = new Date(departureUtc.getTime() + durationMinutes * 60 * 1000);
    }

    // ── build update payload — no entity type, plain object ───────────────
    const updatePayload = {
      ...(data.flightNumber && { flightNumber: data.flightNumber }),
      ...(data.gate !== undefined && { gate: data.gate }),
      ...(data.durationMinutes !== undefined && { durationMinutes: data.durationMinutes }),
      ...(data.bufferMinutes !== undefined && { bufferMinutes: data.bufferMinutes }),
      ...(data.arrivalDestinationId && { arrivalDestinationId: data.arrivalDestinationId }),
      ...(data.baseFare && { baseFare: data.baseFare }),
      ...(data.seatSurcharge && { seatSurcharge: data.seatSurcharge }),
      ...(data.baggageRules && { baggageRules: data.baggageRules }),
      ...(data.luggageRuleId !== undefined && { luggageRuleId: data.luggageRuleId }),
      ...(data.foodMenuId && { foodMenuId: data.foodMenuId }),
      ...(data.amenities !== undefined && { amenities: data.amenities }),
      ...(newDepartureTime && { departureTime: newDepartureTime }),
      ...(newArrivalTime && { arrivalTime: newArrivalTime }),
      ...(calculatedArrivalTime && { arrivalTime: calculatedArrivalTime }),
    };

    await this._flightRepository.updateFlight(flightId, updatePayload);
    const updatedFlight = await this._flightRepository.getFlightDetails(flightId);
    if (!updatedFlight) throw new NotFoundError(FLIGHT_MESSAGES.NOT_FOUND);

    return FlightMapper.toFlightDetailsDTO(updatedFlight);
  }
}