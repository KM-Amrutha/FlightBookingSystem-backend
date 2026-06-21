import {
  IFlightRepository,
  IAircraftRepository,
  IProviderRepository,
} from "@di/file-imports-index";
import { FlightDetailsDTO } from "@application/dtos/flight-dtos";
import {
  APPLICATION_MESSAGES,
  AUTH_MESSAGES,
  FLIGHT_MESSAGES,
  PROVIDER_MESSAGES,
} from "@shared/constants/index.constants";
import { validationError, NotFoundError, ForbiddenError } from "@presentation/middlewares/error.middleware";
import { inject, injectable } from "inversify";
import { TYPES_REPOSITORIES, TYPES_AIRCRAFT_REPOSITORIES } from "@di/types-repositories";
import { IDeleteFlightUseCase } from "@di/file-imports-index";
import { FlightMapper } from "@application/mappers/flightMapper";

@injectable()
export class DeleteFlightUseCase implements IDeleteFlightUseCase {
  constructor(
    @inject(TYPES_AIRCRAFT_REPOSITORIES.FlightRepository)
    private _flightRepository: IFlightRepository,
    @inject(TYPES_AIRCRAFT_REPOSITORIES.AircraftRepository)
    private _aircraftRepository: IAircraftRepository,
    @inject(TYPES_REPOSITORIES.ProviderRepository)
    private _providerRepository: IProviderRepository
  ) {}

  private async validateProvider(providerId: string): Promise<void> {
    const [provider, isBlocked] = await Promise.all([
      this._providerRepository.getProviderDetailsById(providerId),
      this._providerRepository.isProviderBlocked(providerId),
    ]);

    if (!provider) throw new NotFoundError(PROVIDER_MESSAGES.PROVIDER_NOT_FOUND);
    if (isBlocked) throw new ForbiddenError(AUTH_MESSAGES.ACCOUNT_BLOCKED);
    if (!provider.isVerified) throw new ForbiddenError(AUTH_MESSAGES.ACCOUNT_NOT_VERIFIED);
  }

  private async validateFlightOwnership(flightId: string, providerId: string) {
    const flight = await this._flightRepository.getFlightDetails(flightId);

    if (!flight) throw new NotFoundError(FLIGHT_MESSAGES.NOT_FOUND);
    if (flight.providerId !== providerId) {
      throw new ForbiddenError(FLIGHT_MESSAGES.DELETE_FORBIDDEN);  
    }

    return flight;
  }

  private validateFlightStatus(flight: Awaited<ReturnType<typeof this._flightRepository.getFlightDetails>>): void {
    if (!flight) return;

    if (flight.flightStatus !== "scheduled") {
      throw new validationError(
        FLIGHT_MESSAGES.CANNOT_DELETE_NON_SCHEDULED(flight.flightStatus)  
      );
    }

    if (flight.adminApproval?.status === "approved") {
      const hoursUntilDeparture =
        (new Date(flight.departureTime).getTime() - Date.now()) / (1000 * 60 * 60);

      if (hoursUntilDeparture < 24) {
        throw new validationError(FLIGHT_MESSAGES.CANNOT_DELETE_WITHIN_24H);
      }
    }
  }

  async execute(flightId: string, providerId: string): Promise<FlightDetailsDTO> {
    if (!flightId || !providerId) {
      throw new validationError(APPLICATION_MESSAGES.ALL_FIELDS_ARE_REQUIRED);
    }

    if (!flightId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new validationError(FLIGHT_MESSAGES.INVALID_FLIGHT_ID_FORMAT);   
    }

    const [flight] = await Promise.all([
      this.validateFlightOwnership(flightId, providerId),
      this.validateProvider(providerId),
    ]);

    this.validateFlightStatus(flight);

    const deleted = await this._flightRepository.deleteFlightById(flightId);
    if (!deleted) throw new NotFoundError(FLIGHT_MESSAGES.NOT_FOUND);

    if (flight.aircraftId) {
      await this._aircraftRepository.updateStatus(
        flight.aircraftId.toString(),
        "active"
      );
    }
    return FlightMapper.toFlightDetailsDTO(deleted);
  }
}