import {
  IFlightRepository,
  IAircraftRepository,
  IProviderRepository,
  IDestinationRepository
} from "@di/file-imports-index";
import { CreateFlightDTO, FlightDetailsDTO } from "@application/dtos/flight-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import { inject, injectable } from "inversify";
import { TYPES_AIRCRAFT_REPOSITORIES, TYPES_REPOSITORIES } from "@di/types-repositories";
import { ICreateFlightUseCase } from "@di/file-imports-index";
import { APPLICATION_MESSAGES, AUTH_MESSAGES, AIRCRAFT_MESSAGES } from "@shared/constants/index.constants";

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
    private _destinationRepository: IDestinationRepository

  ) {}

  async execute(providerId: string, data: CreateFlightDTO): Promise<FlightDetailsDTO> {
  if (!providerId) {
    throw new validationError(APPLICATION_MESSAGES.ALL_FIELDS_ARE_REQUIRED);
  }

  // basic required checks
  if (
    !data.aircraftId ||
    !data.departureDestinationId ||
    !data.arrivalDestinationId ||
    !data.durationMinutes
  ) {
    throw new validationError(APPLICATION_MESSAGES.ALL_FIELDS_ARE_REQUIRED);
  }

  // Duration validation
  if (data.durationMinutes < 30 || data.durationMinutes > 1440) {
    throw new validationError("Flight duration must be between 30min and 24h");
  }

  // provider checks (blocked / verified)
  const [provider, isBlocked, departureDest, arrivalDest] = await Promise.all([
    this._providerRepository.getProviderDetailsById(providerId),
    this._providerRepository.isProviderBlocked(providerId),
    this._destinationRepository.findById(data.departureDestinationId),
    this._destinationRepository.findById(data.arrivalDestinationId)
  ]);

  if (!provider) {
    throw new validationError("Provider not found");
  }
  if (isBlocked) {
    throw new validationError(AUTH_MESSAGES.ACCOUNT_BLOCKED);
  }
  if (!provider.isVerified) {
    throw new validationError(AUTH_MESSAGES.ACCOUNT_NOT_VERIFIED);
  }

  // Destination validation
  if (!departureDest || !arrivalDest) {
    throw new validationError("Invalid departure or arrival destination");
  }

  // Parse departure time (LOCAL to departure airport)
  const departureLocal = new Date(data.departureTime);
  if (isNaN(departureLocal.getTime())) {
    throw new validationError("Invalid departure time format");
  }

  // 🧮 TIMEZONE CALCULATION STARTS HERE
  // 1. Convert departure LOCAL → UTC
  const departureUtc = new Date(
    departureLocal.toLocaleString("en-US", { timeZone: departureDest.timezone })
  );

  // 2. Add duration → arrival UTC
  const arrivalUtc = new Date(
    departureUtc.getTime() + (data.durationMinutes * 60 * 1000)
  );

  // 3. Convert arrival UTC → LOCAL arrival airport time
  const arrivalLocal = new Date(
    arrivalUtc.toLocaleString("en-US", { timeZone: arrivalDest.timezone })
  );
  // 🧮 TIMEZONE CALCULATION ENDS HERE

  // aircraft validation + ownership
  const aircraft = await this._aircraftRepository.getAircraftById(data.aircraftId);
  if (!aircraft) {
    throw new validationError(AIRCRAFT_MESSAGES.NOT_FOUND);
  }
  if (aircraft.providerId !== providerId) {
    throw new validationError("You don't own this aircraft");
  }
  if (aircraft.status !== "active") {
    throw new validationError("Aircraft must be active to schedule flights");
  }


  // base fare sanity
  if (!data.baseFare || !data.baseFare.economy || data.baseFare.economy <= 0) {
    throw new validationError("Economy base fare is required and must be > 0");
  }

  try {
    // attach aircraft name + calculated arrival time
    const createPayload: CreateFlightDTO & { arrivalTime: Date } = {
      ...data,
      providerId,
      aircraftName: aircraft.aircraftName,
      arrivalTime: arrivalLocal,
      departureTime:departureLocal.toISOString()
    };

    const flight = await this._flightRepository.createFlight(createPayload);
    return flight;
  } catch (err:any) {
    console.error("Flight creation error in usecase1:", err.message || err);
    throw new validationError("Failed to create flight");
  }
}


 
}
