import {
  IFlightRepository,
  IAircraftRepository,
  IProviderRepository,
  IDestinationRepository,
  ISeatRepository,
  IFlightSeatRepository,
} from "@di/file-imports-index";
import { CreateFlightDTO, FlightDetailsDTO } from "@application/dtos/flight-dtos";
import {
  ForbiddenError,
  NotFoundError,
  validationError,
} from "@presentation/middlewares/error.middleware";
import { inject, injectable } from "inversify";
import {
  TYPES_AIRCRAFT_REPOSITORIES,
  TYPES_REPOSITORIES,
} from "@di/types-repositories";
import { ICreateFlightUseCase } from "@di/file-imports-index";
import {
  APPLICATION_MESSAGES,
  PROVIDER_MESSAGES,
  AUTH_MESSAGES,
  FLIGHT_MESSAGES,
} from "@shared/constants/index.constants";
import { FlightMapper } from "@application/mappers/flightMapper";

@injectable()
export class CreateFlightUseCase implements ICreateFlightUseCase {
  constructor(
    @inject(TYPES_AIRCRAFT_REPOSITORIES.FlightRepository)
    private _flightRepository: IFlightRepository,
    @inject(TYPES_AIRCRAFT_REPOSITORIES.AircraftRepository)
    private _aircraftRepository: IAircraftRepository,
    @inject(TYPES_REPOSITORIES.ProviderRepository)
    private _providerRepository: IProviderRepository,
    @inject(TYPES_AIRCRAFT_REPOSITORIES.DestionationRepository)
    private _destinationRepository: IDestinationRepository,
    @inject(TYPES_AIRCRAFT_REPOSITORIES.SeatRepository)
    private _seatRepository: ISeatRepository,
    @inject(TYPES_AIRCRAFT_REPOSITORIES.FlightSeatRepository)
    private _flightSeatRepository: IFlightSeatRepository
  ) {}

  async execute(providerId: string, data: CreateFlightDTO): Promise<FlightDetailsDTO> {
    if (!providerId) throw new validationError(PROVIDER_MESSAGES.ID_REQUIRED);

    if (
      !data.aircraftId ||
      !data.departureDestinationId ||
      !data.arrivalDestinationId ||
      !data.durationMinutes ||
      !data.bufferMinutes
    ) {
      throw new validationError(APPLICATION_MESSAGES.ALL_FIELDS_ARE_REQUIRED);
    }

    if (data.durationMinutes < 30 || data.durationMinutes > 1440) {
      throw new validationError(FLIGHT_MESSAGES.INVALID_DURATION);
    }
    if (data.bufferMinutes < 60) {
      throw new validationError(FLIGHT_MESSAGES.BUFFER_INVALID);
    }

    const [provider, isBlocked, departureDest, arrivalDest] = await Promise.all([
      this._providerRepository.getProviderDetailsById(providerId),
      this._providerRepository.isProviderBlocked(providerId),
      this._destinationRepository.findById(data.departureDestinationId),
      this._destinationRepository.findById(data.arrivalDestinationId),
    ]);

    if (!provider) throw new NotFoundError(PROVIDER_MESSAGES.PROVIDER_NOT_FOUND);
    if (isBlocked) throw new ForbiddenError(AUTH_MESSAGES.ACCOUNT_BLOCKED);
    if (!provider.isVerified) throw new ForbiddenError(AUTH_MESSAGES.ACCOUNT_NOT_VERIFIED);
    if (!provider.adminApproval || provider.profileStatus !== "approved") {
      throw new validationError(PROVIDER_MESSAGES.NOT_APPROVED);
    }
    if (provider.licenseExpiryDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expiryDate = new Date(provider.licenseExpiryDate);
      expiryDate.setHours(0, 0, 0, 0);
      if (expiryDate < today) throw new validationError(PROVIDER_MESSAGES.LICENSE_EXPIRED);
    }

    if (!departureDest || !arrivalDest) {
      throw new NotFoundError(FLIGHT_MESSAGES.INVALID_DESTINATION);
    }

    const departureUtc = new Date(data.departureTime);
    if (isNaN(departureUtc.getTime())) {
      throw new validationError(FLIGHT_MESSAGES.INVALID_TIME);
    }

    const aircraft = await this._aircraftRepository.getAircraftById(data.aircraftId);
    if (!aircraft) throw new NotFoundError(FLIGHT_MESSAGES.AIRCRAFT_NOT_FOUND);
    if (aircraft.providerId !== providerId) throw new ForbiddenError(FLIGHT_MESSAGES.AIRCRAFT_OWNERSHIP_INVALID);
    if (aircraft.status !== "active") throw new validationError(FLIGHT_MESSAGES.AIRCRAFT_INACTIVE);
    if (aircraft.baseStationId.toString() !== data.departureDestinationId.toString()) {
      throw new validationError(FLIGHT_MESSAGES.INVALID_DESTINATION);
    }

    if (!data.baseFare?.economy || data.baseFare.economy <= 0) {
      throw new validationError(FLIGHT_MESSAGES.INVALID_BASE_FARE);
    }

    // ── conflict check ──────────────────────────────────────────────────────
    const existingFlights = await this._flightRepository.getActiveFlightsForAircraft(data.aircraftId);
    const existingFlightDTOs = existingFlights.map((f) => FlightMapper.toFlightDetailsDTO(f));

    const newWindowStart = departureUtc;
    const newWindowEnd = new Date(
      departureUtc.getTime() +
        (data.durationMinutes + data.bufferMinutes + data.durationMinutes + data.bufferMinutes) * 60 * 1000
    );

    const hasConflict = existingFlightDTOs
      .filter((f) => f.flightType === "outbound" || f.flightType === "recurring")
      .some((flight) => {
        const existingBuffer = flight.bufferMinutes ?? data.bufferMinutes;
        const existingStart = new Date(flight.departureTime);
        const existingEnd = new Date(
          existingStart.getTime() +
            (flight.durationMinutes + existingBuffer + flight.durationMinutes + existingBuffer) * 60 * 1000
        );
        return newWindowStart < existingEnd && existingStart < newWindowEnd;
      });

    if (hasConflict) throw new validationError(FLIGHT_MESSAGES.NOT_AVAILABLE_THIS_TIME);

    console.log("USECASE amenities before repo:", data.amenities);

    // ── create outbound flight — entity built inline, no input mapper ────────
    const outboundFlight = await this._flightRepository.createFlight({
      flightId: data.flightId,
      flightNumber: data.flightNumber,
      providerId,
      aircraftId: data.aircraftId,
      aircraftName: aircraft.aircraftName,
      ...(data.seatLayoutId && { seatLayoutId: data.seatLayoutId }),
      departureDestinationId: data.departureDestinationId,
      arrivalDestinationId: data.arrivalDestinationId,
      departureTime: departureUtc,
      arrivalTime: new Date(departureUtc.getTime() + data.durationMinutes * 60 * 1000),
      durationMinutes: data.durationMinutes,
      bufferMinutes: data.bufferMinutes,
      baseFare: data.baseFare,
      seatSurcharge: data.seatSurcharge,
      baggageRules: data.baggageRules,
      ...(data.gate && { gate: data.gate }),
      ...(data.luggageRuleId && { luggageRuleId: data.luggageRuleId }),
      ...(data.foodMenuId && { foodMenuId: data.foodMenuId }),
      ...(data.amenities && data.amenities.length > 0 && { amenities: data.amenities }),
      flightType: "outbound",
    });

    const outboundFlightDTO = FlightMapper.toFlightDetailsDTO(outboundFlight);

    // ── seats for outbound — entity built inline, no input mapper ────────────
    const aircraftSeats = await this._seatRepository.getSeatsByAircraftId(data.aircraftId);

    if (aircraftSeats.length > 0) {
      await this._flightSeatRepository.createFlightSeats(
        aircraftSeats.map((seat) => ({
          flightId: outboundFlight.id,
          aircraftId: data.aircraftId,
          seatId: seat.id,
          seatNumber: seat.seatNumber,
          rowNumber: seat.rowNumber,
          columnPosition: seat.columnPosition,
          section: seat.section,
          position: seat.position,
          cabinClass: seat.cabinClass ?? "economy",
          isExitRow: seat.isExitRow,
          features: seat.features,
          isBooked: false,
          isBlocked: seat.isBlocked,
          isLocked: false,
        }))
      );
    }

    // ── create return flight — entity built inline, no input mapper ──────────
    const outboundArrivalUtc = new Date(departureUtc.getTime() + data.durationMinutes * 60 * 1000);
    const returnDepartureUtc = new Date(outboundArrivalUtc.getTime() + data.bufferMinutes * 60 * 1000);

    const returnFlight = await this._flightRepository.createFlight({
      flightId: `${data.flightId}-R`,
      flightNumber: `${data.flightNumber}-R`,
      providerId,
      aircraftId: data.aircraftId,
      aircraftName: aircraft.aircraftName,
      ...(data.seatLayoutId && { seatLayoutId: data.seatLayoutId }),
      departureDestinationId: data.arrivalDestinationId,
      arrivalDestinationId: data.departureDestinationId,
      departureTime: returnDepartureUtc,
      arrivalTime: new Date(returnDepartureUtc.getTime() + data.durationMinutes * 60 * 1000),
      durationMinutes: data.durationMinutes,
      bufferMinutes: data.bufferMinutes,
      baseFare: data.baseFare,
      seatSurcharge: data.seatSurcharge,
      baggageRules: data.baggageRules,
      ...(data.gate && { gate: data.gate }),
      ...(data.luggageRuleId && { luggageRuleId: data.luggageRuleId }),
      ...(data.foodMenuId && { foodMenuId: data.foodMenuId }),
      ...(data.amenities && data.amenities.length > 0 && { amenities: data.amenities }),
      flightType: "return",
      parentFlightId: outboundFlightDTO.id, 
    });

    // ── seats for return ─────────────────────────────────────────────────────
    if (aircraftSeats.length > 0) {
      await this._flightSeatRepository.createFlightSeats(
        aircraftSeats.map((seat) => ({
          flightId: returnFlight.id,
          aircraftId: data.aircraftId,
          seatId: seat.id,
          seatNumber: seat.seatNumber,
          rowNumber: seat.rowNumber,
          columnPosition: seat.columnPosition,
          section: seat.section,
          position: seat.position,
          cabinClass: seat.cabinClass ?? "economy",
          isExitRow: seat.isExitRow,
          features: seat.features,
          isBooked: false,
          isBlocked: seat.isBlocked,
          isLocked: false,
        }))
      );
    }

    return outboundFlightDTO;
  }
}