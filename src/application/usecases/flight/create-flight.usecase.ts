import {
  IFlightRepository,
  IAircraftRepository,
  IProviderRepository,
  IDestinationRepository,
  ISeatRepository,
  IFlightSeatRepository
} from "@di/file-imports-index";
import { CreateFlightDTO, FlightDetailsDTO } from "@application/dtos/flight-dtos";
import { CreateFlightSeatDTO } from "@application/dtos/flightSeat-dtos";
import { ForbiddenError,
         NotFoundError,
         validationError } from "@presentation/middlewares/error.middleware";
import { inject, injectable } from "inversify";
import { TYPES_AIRCRAFT_REPOSITORIES,
         TYPES_REPOSITORIES } from "@di/types-repositories";
import { ICreateFlightUseCase } from "@di/file-imports-index";
import { APPLICATION_MESSAGES,
         AUTH_MESSAGES,
         AIRCRAFT_MESSAGES } from "@shared/constants/index.constants";
import { FlightMapper } from "@application/mappers/flightMapper";
import { FlightSeatMapper } from "@application/mappers/flightSeatMapper";

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
    if (!providerId) throw new NotFoundError("Provider ID is required");

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
      throw new validationError("Flight duration must be between 30min and 24h");

}
  if (!data.bufferMinutes || data.bufferMinutes < 60) {
  throw new validationError("Buffer time must be at least 60 minutes");
    }

    const [provider, isBlocked, departureDest, arrivalDest] = await Promise.all([
      this._providerRepository.getProviderDetailsById(providerId),
      this._providerRepository.isProviderBlocked(providerId),
      this._destinationRepository.findById(data.departureDestinationId),
      this._destinationRepository.findById(data.arrivalDestinationId)
    ]);

    if (!provider) throw new NotFoundError("Provider not found");
    if (isBlocked) throw new ForbiddenError(AUTH_MESSAGES.ACCOUNT_BLOCKED);
    if (!provider.isVerified) throw new ForbiddenError(AUTH_MESSAGES.ACCOUNT_NOT_VERIFIED);
    if (!provider.adminApproval || provider.profileStatus !== "approved") {
      throw new validationError("Your profile must be approved by admin before scheduling flights");
    }
    if (provider.licenseExpiryDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expiryDate = new Date(provider.licenseExpiryDate);
      expiryDate.setHours(0, 0, 0, 0);
      if (expiryDate < today) {
        throw new validationError("Your license has expired. Please renew it before scheduling flights.");
      }
    }

    if (!departureDest || !arrivalDest) {
      throw new NotFoundError("Invalid departure or arrival destination");
    }

    const departureUtc = new Date(data.departureTime);
    if (isNaN(departureUtc.getTime())) {
      throw new validationError("Invalid departure time format");
    }

    const aircraft = await this._aircraftRepository.getAircraftById(data.aircraftId);
    if (!aircraft) throw new NotFoundError(AIRCRAFT_MESSAGES.NOT_FOUND);
    if (aircraft.providerId !== providerId) throw new ForbiddenError("You don't own this aircraft");
    if (aircraft.status !== "active") throw new validationError("Aircraft must be active to schedule flights");
    if (aircraft.baseStationId.toString() !== data.departureDestinationId.toString()) {
      throw new validationError("Flight must depart from the aircraft's base station");
    }

    if (!data.baseFare?.economy || data.baseFare.economy <= 0) {
      throw new validationError("Economy base fare is required and must be > 0");
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

if (hasConflict) {
  throw new validationError("Aircraft is not available for this time window — schedule conflict detected");
}

    // ── outbound flight ─────────────────────────────────────────────────────
    const outboundDTO: CreateFlightDTO = {
      ...data,
      aircraftName: aircraft.aircraftName,
      flightType: "outbound",
    };

    // mapper converts DTO → entity, repo stays clean
    const outboundFlight = await this._flightRepository.createFlight(
      FlightMapper.toFlightEntity(outboundDTO)
    );
    const outboundFlightDTO = FlightMapper.toFlightDetailsDTO(outboundFlight);

    // ── seats for outbound ──────────────────────────────────────────────────
    const aircraftSeats = await this._seatRepository.getSeatsByAircraftId(data.aircraftId);

    if (aircraftSeats.length > 0) {
      const outboundSeats: CreateFlightSeatDTO[] = aircraftSeats.map((seat) => ({
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
      }));

      // mapper converts DTO → entity, repo stays clean
      await this._flightSeatRepository.createFlightSeats(
        FlightSeatMapper.toFlightSeatEntities(outboundSeats)
      );
    }

    // ── return flight ───────────────────────────────────────────────────────
    const outboundArrivalUtc = new Date(
      departureUtc.getTime() + data.durationMinutes * 60 * 1000
    );
   const returnDepartureUtc = new Date(
  outboundArrivalUtc.getTime() + data.bufferMinutes * 60 * 1000
);

    const returnDTO: CreateFlightDTO = {
      flightId: `${data.flightId}-R`,
      flightNumber: `${data.flightNumber}-R`,
      providerId,
      aircraftId: data.aircraftId,
      aircraftName: aircraft.aircraftName,
      ...(data.seatLayoutId && { seatLayoutId: data.seatLayoutId }),
      departureDestinationId: data.arrivalDestinationId,
      arrivalDestinationId: data.departureDestinationId,
      departureTime: returnDepartureUtc.toISOString(),
      durationMinutes: data.durationMinutes,
      bufferMinutes: data.bufferMinutes,
      baseFare: data.baseFare,
      seatSurcharge: data.seatSurcharge,
      baggageRules: data.baggageRules,
      ...(data.gate && { gate: data.gate }),
      ...(data.luggageRuleId && { luggageRuleId: data.luggageRuleId }),
      ...(data.foodMenuId && { foodMenuId: data.foodMenuId }),
      flightType: "return",
      parentFlightId: outboundFlightDTO._id,
    };

    const returnFlight = await this._flightRepository.createFlight(
      FlightMapper.toFlightEntity(returnDTO)
    );

    // ── seats for return ────────────────────────────────────────────────────
    if (aircraftSeats.length > 0) {
      const returnSeats: CreateFlightSeatDTO[] = aircraftSeats.map((seat) => ({
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
      }));

      await this._flightSeatRepository.createFlightSeats(
        FlightSeatMapper.toFlightSeatEntities(returnSeats)
      );
    }

    return outboundFlightDTO;
  }
}