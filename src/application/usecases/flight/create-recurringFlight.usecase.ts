import {
  IFlightRepository,
  IAircraftRepository,
  IProviderRepository,
  IDestinationRepository,
  ISeatRepository,
  IFlightSeatRepository,
} from "@di/file-imports-index";
import {
  CreateRecurringFlightDTO,
  FlightDetailsDTO,
  RecurringFlightResultDTO,
} from "@application/dtos/flight-dtos";
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
import { ICreateRecurringFlightUseCase } from "@di/file-imports-index";
import {
  AUTH_MESSAGES,
  AIRCRAFT_MESSAGES,
  PROVIDER_MESSAGES,
  FLIGHT_MESSAGES,
} from "@shared/constants/index.constants";
import { FlightMapper } from "@application/mappers/flightMapper";

const MAX_DATE_RANGE_DAYS = 30;

@injectable()
export class CreateRecurringFlightUseCase implements ICreateRecurringFlightUseCase {
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

  async execute(
    providerId: string,
    data: CreateRecurringFlightDTO
  ): Promise<RecurringFlightResultDTO> {

    // ── validation ──────────────────────────────────────────────────────────
    if (!providerId) throw new NotFoundError(FLIGHT_MESSAGES.PROVIDER_ID_REQUIRED);  

    if (
      !data.aircraftId ||
      !data.departureDestinationId ||
      !data.arrivalDestinationId ||
      !data.baseFlightId ||
      !data.baseFlightNumber ||
      !data.departureTimeOfDay ||
      !data.startDate ||
      !data.endDate ||
      !data.weekdays?.length ||
      !data.durationMinutes
    ) {
      throw new validationError(FLIGHT_MESSAGES.ALL_FIELDS_REQUIRED_RECURRING);  
    }

    if (data.durationMinutes < 30 || data.durationMinutes > 1440) {
      throw new validationError(FLIGHT_MESSAGES.INVALID_DURATION);              
    }

    if (!data.weekdays.every((d) => d >= 0 && d <= 6)) {
      throw new validationError(FLIGHT_MESSAGES.INVALID_WEEKDAYS);              
    }

    if (!data.bufferMinutes || data.bufferMinutes < 60) {
      throw new validationError(FLIGHT_MESSAGES.BUFFER_INVALID);
    }

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new validationError(FLIGHT_MESSAGES.INVALID_DATE);                  
    }

    if (endDate <= startDate) {
      throw new validationError(FLIGHT_MESSAGES.END_DATE_BEFORE_START);          
    }

    const diffDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays > MAX_DATE_RANGE_DAYS) {
      throw new validationError(FLIGHT_MESSAGES.DATE_RANGE_EXCEEDED(MAX_DATE_RANGE_DAYS)); 
    }

    // ── provider checks ─────────────────────────────────────────────────────
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

    // ── aircraft checks ─────────────────────────────────────────────────────
    const aircraft = await this._aircraftRepository.getAircraftById(data.aircraftId);
    if (!aircraft) throw new NotFoundError(AIRCRAFT_MESSAGES.NOT_FOUND);
    if (aircraft.providerId !== providerId) throw new ForbiddenError(FLIGHT_MESSAGES.AIRCRAFT_OWNERSHIP_INVALID); 
    if (aircraft.status !== "active") throw new validationError(FLIGHT_MESSAGES.AIRCRAFT_INACTIVE); 
    if (aircraft.baseStationId.toString() !== data.departureDestinationId.toString()) {
      throw new validationError(FLIGHT_MESSAGES.INVALID_DESTINATION);
    }

    if (!data.baseFare?.economy || data.baseFare.economy <= 0) {
      throw new validationError(FLIGHT_MESSAGES.INVALID_BASE_FARE);              
    }

    // ── generate matching dates ─────────────────────────────────────────────
    const matchingDates = this._generateMatchingDates(startDate, endDate, data.weekdays);

    if (matchingDates.length === 0) {
      throw new validationError(FLIGHT_MESSAGES.NO_MATCHING_DATES);              
    }

    // ── parse departure time ────────────────────────────────────────────────
    const timeParts = data.departureTimeOfDay.split(":");
    const hours = parseInt(timeParts[0] ?? "0", 10);
    const minutes = parseInt(timeParts[1] ?? "0", 10);

    if (isNaN(hours) || isNaN(minutes)) {
      throw new validationError(FLIGHT_MESSAGES.INVALID_TIME);
    }

    // ── fetch aircraft seats once ───────────────────────────────────────────
    const aircraftSeats = await this._seatRepository.getSeatsByAircraftId(data.aircraftId);

    // ── fetch existing flights for conflict check ───────────────────────────
    const existingFlights = await this._flightRepository.getActiveFlightsForAircraft(data.aircraftId);
    const existingFlightDTOs = existingFlights.map((f) => FlightMapper.toFlightDetailsDTO(f));

    const recurringGroupId = `${data.baseFlightId}-GROUP`;
    const created: FlightDetailsDTO[] = [];
    const skipped: { date: string; reason: string }[] = [];
    let occurrenceIndex = 1;

    // ── process each date ───────────────────────────────────────────────────
    for (const date of matchingDates) {
      const departureUtc = new Date(date);
      departureUtc.setUTCHours(hours, minutes, 0, 0);

      const arrivalUtc = new Date(departureUtc.getTime() + data.durationMinutes * 60 * 1000);

      const windowEnd = new Date(
        arrivalUtc.getTime() +
          data.bufferMinutes * 60 * 1000 +
          data.durationMinutes * 60 * 1000 +
          data.bufferMinutes * 60 * 1000
      );

      const hasConflict = this._hasWindowConflict(
        departureUtc,
        windowEnd,
        existingFlightDTOs,
        data.bufferMinutes
      );

      if (hasConflict) {
        skipped.push({
          date: date.toISOString().split("T")[0] ?? date.toISOString(),
          reason: FLIGHT_MESSAGES.AIRCRAFT_WINDOW_CONFLICT,          
        });
        continue;
      }

      // ── create outbound flight — entity built inline, no input mapper ──────
      const outboundFlight = await this._flightRepository.createFlight({
        flightId: `${data.baseFlightId}-${occurrenceIndex}`,
        flightNumber: `${data.baseFlightNumber}-${occurrenceIndex}`,
        providerId,
        aircraftId: data.aircraftId,
        aircraftName: aircraft.aircraftName,
        ...(data.seatLayoutId && { seatLayoutId: data.seatLayoutId }),
        departureDestinationId: data.departureDestinationId,
        arrivalDestinationId: data.arrivalDestinationId,
        departureTime: departureUtc,
        arrivalTime: arrivalUtc,
        durationMinutes: data.durationMinutes,
        bufferMinutes: data.bufferMinutes,
        baseFare: data.baseFare,
        seatSurcharge: data.seatSurcharge,
        baggageRules: data.baggageRules,
        ...(data.gate && { gate: data.gate }),
        ...(data.luggageRuleId && { luggageRuleId: data.luggageRuleId }),
        ...(data.foodMenuId && { foodMenuId: data.foodMenuId }),
        flightType: "recurring",
        recurringGroupId,
        recurringDays: data.weekdays,
      });

      const outboundFlightDTO = FlightMapper.toFlightDetailsDTO(outboundFlight);

      // ── seats for outbound — entity built inline, no input mapper ──────────
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

      // ── create return flight — entity built inline, no input mapper ─────────
      const returnDepartureUtc = new Date(arrivalUtc.getTime() + data.bufferMinutes * 60 * 1000);

      const returnFlight = await this._flightRepository.createFlight({
        flightId: `${data.baseFlightId}-${occurrenceIndex}-R`,
        flightNumber: `${data.baseFlightNumber}-${occurrenceIndex}-R`,
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
        flightType: "return",
        parentFlightId: outboundFlightDTO.id,  
        recurringGroupId,
        recurringDays: data.weekdays,
      });

      // ── seats for return ────────────────────────────────────────────────────
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

      // ── update in-memory conflict tracker ───────────────────────────────────
      created.push(outboundFlightDTO);
      existingFlightDTOs.push(outboundFlightDTO);
      occurrenceIndex++;
    }

    return {
      created,
      skipped,
      totalCreated: created.length,
      totalSkipped: skipped.length,
    };
  }

  // ── private helpers ────────────────────────────────────────────────────────

  private _generateMatchingDates(
    startDate: Date,
    endDate: Date,
    weekdays: number[]
  ): Date[] {
    const dates: Date[] = [];
    const current = new Date(startDate);
    current.setUTCHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setUTCHours(0, 0, 0, 0);
    while (current <= end) {
      if (weekdays.includes(current.getUTCDay())) {
        dates.push(new Date(current));
      }
      current.setUTCDate(current.getUTCDate() + 1);
    }
    return dates;
  }

  private _hasWindowConflict(
    newWindowStart: Date,
    newWindowEnd: Date,
    existingFlightDTOs: FlightDetailsDTO[],
    newBufferMinutes: number
  ): boolean {
    const outbounds = existingFlightDTOs.filter(
      (f) => f.flightType === "outbound" || f.flightType === "recurring"
    );
    for (const flight of outbounds) {
      const existingBuffer = flight.bufferMinutes ?? newBufferMinutes;
      const existingStart = new Date(flight.departureTime);
      const existingEnd = new Date(
        existingStart.getTime() +
          flight.durationMinutes * 60 * 1000 +
          existingBuffer * 60 * 1000 +
          flight.durationMinutes * 60 * 1000 +
          existingBuffer * 60 * 1000
      );
      if (newWindowStart < existingEnd && existingStart < newWindowEnd) return true;
    }
    return false;
  }
}