import {
  IFlightRepository,
  IAircraftRepository,
  IProviderRepository,
  IDestinationRepository,
  ISeatRepository,
  IFlightSeatRepository,
} from "@di/file-imports-index";
import {
  CreateFlightDTO,
  CreateRecurringFlightDTO,
  FlightDetailsDTO,
  RecurringFlightResultDTO,
} from "@application/dtos/flight-dtos";
import { CreateFlightSeatDTO } from "@application/dtos/flightSeat-dtos";
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
import { AUTH_MESSAGES, AIRCRAFT_MESSAGES } from "@shared/constants/index.constants";
import { FlightMapper } from "@application/mappers/flightMapper";
import { FlightSeatMapper } from "@application/mappers/flightSeatMapper";

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
    if (!providerId) throw new NotFoundError("Provider ID is required");

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
      throw new validationError("All fields are required for recurring flight");
    }

    if (data.durationMinutes < 30 || data.durationMinutes > 1440) {
      throw new validationError("Duration must be between 30 minutes and 24 hours");
    }

    if (!data.weekdays.every((d) => d >= 0 && d <= 6)) {
      throw new validationError("Weekdays must be between 0 (Sun) and 6 (Sat)");
    }
    if (!data.bufferMinutes || data.bufferMinutes < 60) {
  throw new validationError("Buffer time must be at least 60 minutes");
}

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new validationError("Invalid start or end date");
    }

    if (endDate <= startDate) {
      throw new validationError("End date must be after start date");
    }

    const diffDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays > MAX_DATE_RANGE_DAYS) {
      throw new validationError(`Date range cannot exceed ${MAX_DATE_RANGE_DAYS} days`);
    }

    // ── provider checks ──────────────────────────────────────────────────────
    const [provider, isBlocked, departureDest, arrivalDest] = await Promise.all([
      this._providerRepository.getProviderDetailsById(providerId),
      this._providerRepository.isProviderBlocked(providerId),
      this._destinationRepository.findById(data.departureDestinationId),
      this._destinationRepository.findById(data.arrivalDestinationId),
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

    // ── aircraft checks ──────────────────────────────────────────────────────
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

    // ── generate all matching dates ──────────────────────────────────────────
    const matchingDates = this._generateMatchingDates(startDate, endDate, data.weekdays);

    if (matchingDates.length === 0) {
      throw new validationError("No dates match the selected weekdays in the given range");
    }

    // ── fetch aircraft seats once — reused for all occurrences ───────────────
    const aircraftSeats = await this._seatRepository.getSeatsByAircraftId(data.aircraftId);

    // ── fetch existing flights for conflict check ────────────────────────────
    // fetched once and passed to conflict checker — avoids N repo calls
    const existingFlights = await this._flightRepository.getActiveFlightsForAircraft(
      data.aircraftId
    );
    const existingFlightDTOs = existingFlights.map((f) =>
      FlightMapper.toFlightDetailsDTO(f)
    );
    const timeParts = data.departureTimeOfDay.split(":");
const hours = parseInt(timeParts[0] ?? "0", 10);
const minutes = parseInt(timeParts[1] ?? "0", 10);

if (isNaN(hours) || isNaN(minutes)) {
  throw new validationError("Invalid departure time format. Use HH:mm");
}

    // ── recurringGroupId — shared across all occurrences ─────────────────────
    const recurringGroupId = `${data.baseFlightId}-GROUP`;

    const created: FlightDetailsDTO[] = [];
    const skipped: { date: string; reason: string }[] = [];
    let occurrenceIndex = 1;

    // ── process each date ────────────────────────────────────────────────────
    for (const date of matchingDates) {
     

      const departureUtc = new Date(date);
      departureUtc.setUTCHours(hours, minutes, 0, 0);

      const arrivalUtc = new Date(
        departureUtc.getTime() + data.durationMinutes * 60 * 1000
      );

      // compute full window for this occurrence
     const windowEnd = new Date(
  arrivalUtc.getTime() +
    data.bufferMinutes * 60 * 1000 +        // ← provider's buffer
    data.durationMinutes * 60 * 1000 +
    data.bufferMinutes * 60 * 1000          // ← provider's buffer
);

      // check conflict against existing flights + already created occurrences
      const hasConflict = this._hasWindowConflict(
        departureUtc,
        windowEnd,
        existingFlightDTOs,
        data.bufferMinutes
      );

      if (hasConflict) {
        skipped.push({
          date: date.toISOString().split("T")[0] ?? date.toISOString(),
          reason: "Aircraft not available — time window conflict",
        });
        continue;
      }

      // ── create outbound flight ─────────────────────────────────────────────
      const outboundDTO: CreateFlightDTO = {
        flightId: `${data.baseFlightId}-${occurrenceIndex}`,
        flightNumber: `${data.baseFlightNumber}-${occurrenceIndex}`,
        providerId,
        aircraftId: data.aircraftId,
        aircraftName: aircraft.aircraftName,
        ...(data.seatLayoutId && { seatLayoutId: data.seatLayoutId }),
        departureDestinationId: data.departureDestinationId,
        arrivalDestinationId: data.arrivalDestinationId,
        departureTime: departureUtc.toISOString(),
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
      };

      const outboundFlight = await this._flightRepository.createFlight(
        FlightMapper.toFlightEntity(outboundDTO)
      );
      const outboundFlightDTO = FlightMapper.toFlightDetailsDTO(outboundFlight);

      // ── seats for outbound ─────────────────────────────────────────────────
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

        await this._flightSeatRepository.createFlightSeats(
          FlightSeatMapper.toFlightSeatEntities(outboundSeats)
        );
      }

      // ── return flight ──────────────────────────────────────────────────────
      const returnDepartureUtc = new Date(
  arrivalUtc.getTime() + data.bufferMinutes * 60 * 1000
);

      const returnDTO: CreateFlightDTO = {
        flightId: `${data.baseFlightId}-${occurrenceIndex}-R`,
        flightNumber: `${data.baseFlightNumber}-${occurrenceIndex}-R`,
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
        recurringGroupId,
        recurringDays: data.weekdays,
      };

      const returnFlight = await this._flightRepository.createFlight(
        FlightMapper.toFlightEntity(returnDTO)
      );

      // ── seats for return ───────────────────────────────────────────────────
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

      // ── add to created list + update in-memory conflict tracker ───────────
      created.push(outboundFlightDTO);

      // add this occurrence to existingFlightDTOs so next occurrence
      // checks against already created ones too
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

  /**
   * Generate all dates between startDate and endDate that match the given weekdays
   */
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

  /**
   * Check if a new window overlaps with any existing outbound/recurring flight window
   */
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
    // use the buffer stored on the existing flight, fallback to new buffer
    const existingBuffer = flight.bufferMinutes ?? newBufferMinutes;
    const existingStart = new Date(flight.departureTime);
    const existingEnd = new Date(
      existingStart.getTime() +
        flight.durationMinutes * 60 * 1000 +
        existingBuffer * 60 * 1000 +
        flight.durationMinutes * 60 * 1000 +
        existingBuffer * 60 * 1000
    );

    if (newWindowStart < existingEnd && existingStart < newWindowEnd) {
      return true;
    }
  }

  return false;
}
}