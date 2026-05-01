import { injectable, inject } from "inversify";
import {
  TYPES_REPOSITORIES,
  TYPES_AIRCRAFT_REPOSITORIES,
} from "@di/types-repositories";
import {
  IFlightRepository,
  IDestinationRepository,
  IProviderRepository,
  
} from "@di/file-imports-index";
import { IUpdateFlightUseCase } from "@di/file-imports-index";
import {
  UpdateFlightDTO,
  FlightDetailsDTO,
} from "@application/dtos/flight-dtos";
import { IFlight } from "@domain/entities/flight.entity";
import { validationError,NotFoundError, ForbiddenError } from "@presentation/middlewares/error.middleware";
import { AUTH_MESSAGES } from "@shared/constants/index.constants";
import { FlightMapper } from "@application/mappers/flightMapper";


@injectable()
export class UpdateFlightUseCase implements IUpdateFlightUseCase {
  constructor(
    @inject(TYPES_AIRCRAFT_REPOSITORIES.FlightRepository)
    private readonly _flightRepository: IFlightRepository,
    @inject(TYPES_AIRCRAFT_REPOSITORIES.DestionationRepository)
    private readonly _destinationRepository: IDestinationRepository,
    @inject(TYPES_REPOSITORIES.ProviderRepository)
    private readonly _providerRepository: IProviderRepository
  ) {}

  async execute(
    providerId: string,
    flightId: string,
    data: UpdateFlightDTO
  ): Promise<FlightDetailsDTO> {

    console.log("providerId is", providerId);
    

    if (!providerId || !flightId) {
      throw new validationError("Provider ID and Flight ID are required");

    }

    const flight = await this._flightRepository.getFlightDetails(flightId);
    console.log("flight is: ", flight);

   if (!flight) throw new NotFoundError("Flight not found");
if (flight.providerId !== providerId) throw new ForbiddenError("You can only edit your own flights");

      // ── flight status check ──
if (flight.flightStatus !== "scheduled") {
  throw new validationError("Only scheduled flights can be edited");
}

// ── departure time check ──
if (new Date(flight.departureTime) <= new Date()) {
  throw new validationError("Cannot edit a flight that has already departed");
}

// ── recurring/return restriction ──
if (flight.flightType === "recurring" || flight.flightType === "return") {
  if (data.durationMinutes !== undefined) {
    throw new validationError("Duration cannot be edited for recurring or return flights");
  }
  if (data.arrivalDestinationId !== undefined) {
    throw new validationError("Arrival destination cannot be edited for recurring or return flights");
  }
}

    const [provider, isBlocked] = await Promise.all([
      this._providerRepository.getProviderDetailsById(providerId),
      this._providerRepository.isProviderBlocked(providerId),
    ]);

  if (!provider) throw new NotFoundError("Provider not found");
if (isBlocked) throw new ForbiddenError(AUTH_MESSAGES.ACCOUNT_BLOCKED);
if (!provider.isVerified) throw new ForbiddenError(AUTH_MESSAGES.ACCOUNT_NOT_VERIFIED);

    // Duration validation
    if (
      data.durationMinutes !== undefined &&
      (data.durationMinutes < 30 || data.durationMinutes > 1440)
    ) {
      throw new validationError(
        "Flight duration must be between 30 minutes and 24 hours"
      );
    }

    // Base fare validation
    if (
      data.baseFare?.economy !== undefined &&
      data.baseFare.economy <= 0
    ) {
      throw new validationError("Economy base fare must be greater than 0");
    }

    // Recalculate arrival time if duration or arrival destination changes
    let calculatedArrivalTime: Date | undefined;

    const needsRecalculation =
      data.durationMinutes !== undefined ||
      data.arrivalDestinationId !== undefined;

    if (needsRecalculation) {
      const depDest = await this._destinationRepository.findById(
        flight.departureDestinationId
      );
      const arrDestId =
        data.arrivalDestinationId || flight.arrivalDestinationId;
      const arrDest = await this._destinationRepository.findById(arrDestId);

    if (!depDest || !arrDest) throw new NotFoundError("Invalid departure or arrival destination");

      const departureLocal = new Date(flight.departureTime);
      if (isNaN(departureLocal.getTime())) {
        throw new validationError("Invalid stored departure time");
      }

      
        const durationMinutes = data.durationMinutes ?? flight.durationMinutes;

      // Local departure → UTC
      // const departureUtc = new Date(
      //   departureLocal.toLocaleString("en-US", { timeZone: depDest.timezone })
      // );
      const departureUtc = new Date(flight.departureTime);


      // Add duration
      const arrivalUtc = new Date(
        departureUtc.getTime() + durationMinutes * 60 * 1000
      );
      
      calculatedArrivalTime = arrivalUtc;

      // UTC → Local arrival time
      // calculatedArrivalTime = new Date(
      //   arrivalUtc.toLocaleString("en-US", { timeZone: arrDest.timezone })
      // );
    }

    // Build update payload - type-safe intersection
    const updatePayload: Partial<IFlight> & { arrivalTime?: Date } = {
      ...data,
      ...(calculatedArrivalTime && { arrivalTime: calculatedArrivalTime }),
    };

    // Repository will reset adminApproval to pending and clear reason
    const updatedFlight = await this._flightRepository.updateFlight(
      flightId,
      updatePayload
    );

   if (!updatedFlight) throw new NotFoundError("Failed to update flight");

    return FlightMapper.toFlightDetailsDTO(updatedFlight);
  }
}