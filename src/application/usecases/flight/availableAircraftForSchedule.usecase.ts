import { inject, injectable } from "inversify";
import { IAircraftRepository } from "@domain/interfaces/IAircraftRepository";
import { IFlightRepository } from "@domain/interfaces/IFlightRepository";
import { IDestinationRepository } from "@domain/interfaces/IDestinationRepository";
import { validationError } from "@presentation/middlewares/error.middleware";
import { TYPES_AIRCRAFT_REPOSITORIES } from "@di/types-repositories";
import { IAvailableAircraftsForScheduleUsecase } from "@di/file-imports-index";
import { AircraftDetailsDTO } from "@application/dtos/aircraft-dtos";
import { AircraftMapper } from "@application/mappers/aircraftMapper";


@injectable()
export class AvailableAircraftsForScheduleUseCase
  implements IAvailableAircraftsForScheduleUsecase
{
  constructor(
    @inject(TYPES_AIRCRAFT_REPOSITORIES.AircraftRepository)
    private _aircraftRepository: IAircraftRepository,
    @inject(TYPES_AIRCRAFT_REPOSITORIES.FlightRepository)
    private _flightRepository: IFlightRepository,
    @inject(TYPES_AIRCRAFT_REPOSITORIES.DestionationRepository)
    private _destinationRepository: IDestinationRepository
  ) {}

  async execute(
    providerId: string,
    departureDestinationId: string,
    departureTimeIso: string,
    durationMinutes: number,
    bufferMinutes: number,
  ): Promise<AircraftDetailsDTO[]> {
    if (!providerId || !departureDestinationId || !departureTimeIso || !durationMinutes||!bufferMinutes) {
      throw new validationError("All fields are required for availability check");
    }

    const departureTime = new Date(departureTimeIso);
    if (isNaN(departureTime.getTime())) {
      throw new validationError("Invalid departure time");
    }
    if (durationMinutes < 30 || durationMinutes > 1440) {
      throw new validationError("Duration must be between 30 minutes and 24 hours");
    }
      if (bufferMinutes < 60) {
    throw new validationError("Buffer time must be at least 60 minutes");
  }
    const depDest = await this._destinationRepository.findById(departureDestinationId);
    if (!depDest || !depDest.isActive) {
      throw new validationError("Invalid departure destination");
    }
    // repo returns IAircraft[] → map to DTO immediately, entity never leaves this line
    const providerAircrafts = await this._aircraftRepository.getAircraftsByProvider(providerId);
    const eligibleAircraftDTOs = AircraftMapper.toAircraftDTOs(
      providerAircrafts.filter(
        (a) =>
          a.status === "active" &&
          a.baseStationId.toString() === departureDestinationId.toString()
      )
    );
    if (eligibleAircraftDTOs.length === 0) return [];

    const newWindowStart = departureTime;
    const newWindowEnd = this._computeWindowEnd(departureTime, durationMinutes,bufferMinutes);

    const availabilityChecks = await Promise.all(
  eligibleAircraftDTOs.map(async (aircraftDTO) => {
    try {
      const activeFlights = await this._flightRepository.getActiveFlightsForAircraft(
        aircraftDTO._id
      );
      
      const flightDTOs = activeFlights.map((f) => ({
  departureTime: f.departureTime.toISOString(),
  durationMinutes: f.durationMinutes,
  bufferMinutes: f.bufferMinutes,
  flightType: f.flightType,
}));

const isAvailable = this._isAircraftAvailable(
  flightDTOs,
  newWindowStart,
  newWindowEnd,
  bufferMinutes
);
      console.log(`Aircraft ${aircraftDTO._id} availability:`, isAvailable);
      return { aircraftDTO, isAvailable };
    } catch (err) {
      console.error(`Error checking aircraft ${aircraftDTO._id}:`, err);
      return { aircraftDTO, isAvailable: false };
    }
  })
);
console.log("availabilityChecks:", availabilityChecks);
    return availabilityChecks
      .filter(({ isAvailable }) => isAvailable)
      .map(({ aircraftDTO }) => aircraftDTO);
  }

  // ─── private helpers ────────────────────────────────────────────────────────

 private _isAircraftAvailable(
  flightDTOs: {
    departureTime: string;
    durationMinutes: number;
    bufferMinutes?: number;
    flightType: string;
  }[],
  newWindowStart: Date,
  newWindowEnd: Date,
  newBufferMinutes: number
): boolean {
  const outboundFlights = flightDTOs.filter(
    (f) => f.flightType === "outbound" || f.flightType === "recurring"
  );

  for (const flight of outboundFlights) {
    const existingBuffer = flight.bufferMinutes ?? newBufferMinutes;
    const existingWindowStart = new Date(flight.departureTime);
    const existingWindowEnd = this._computeWindowEnd(
      existingWindowStart,
      flight.durationMinutes,
      existingBuffer
    );

    if (this._windowsOverlap(newWindowStart, newWindowEnd, existingWindowStart, existingWindowEnd)) {
      return false;
    }
  }

  return true;
}

 private _computeWindowEnd(departureTime: Date, durationMinutes: number, bufferMinutes: number): Date {
  const totalMinutes = durationMinutes + bufferMinutes + durationMinutes + bufferMinutes;
  return new Date(departureTime.getTime() + totalMinutes * 60 * 1000);
}

  private _windowsOverlap(
    aStart: Date,
    aEnd: Date,
    bStart: Date,
    bEnd: Date
  ): boolean {
    return aStart < bEnd && bStart < aEnd;
  }
}