import { 
  IAircraftRepository, 
  IFlightRepository, 
  IFlightSeatRepository, 
  IProviderRepository, 
  ISeatLayoutRepository,
  ISeatRepository
} from "@di/file-imports-index";
import { AircraftDetailsDTO } from "@application/dtos/aircraft-dtos";
import { AIRCRAFT_MESSAGES, AUTH_MESSAGES, APPLICATION_MESSAGES } from "@shared/constants/index.constants";
import { validationError, NotFoundError, ForbiddenError, ConflictError } from "@presentation/middlewares/error.middleware";
import { inject, injectable } from "inversify";
import { TYPES_REPOSITORIES, TYPES_AIRCRAFT_REPOSITORIES } from "@di/types-repositories";
import { IDeleteAircraftUseCase } from "@di/file-imports-index";
import { AircraftMapper } from "@application/mappers/aircraftMapper";
import { IAircraft } from "@domain/entities/aircraft.entity";


@injectable()
export class DeleteAircraftUseCase implements IDeleteAircraftUseCase {
  constructor(
    @inject(TYPES_AIRCRAFT_REPOSITORIES.AircraftRepository)
    private _aircraftRepository: IAircraftRepository,
    @inject(TYPES_REPOSITORIES.ProviderRepository)
    private _providerRepository: IProviderRepository,
    @inject(TYPES_AIRCRAFT_REPOSITORIES.FlightRepository)
    private _flightRepository: IFlightRepository,
    @inject(TYPES_AIRCRAFT_REPOSITORIES.SeatRepository)
    private _seatRepository: ISeatRepository,
    @inject(TYPES_AIRCRAFT_REPOSITORIES.SeatLayoutRepository)
    private _seatLayoutRepository: ISeatLayoutRepository,
    @inject(TYPES_AIRCRAFT_REPOSITORIES.FlightSeatRepository)
    private _flightSeatRepository: IFlightSeatRepository
  ) {}

  private async validateProvider(providerId: string): Promise<void> {
    const [provider, isBlocked] = await Promise.all([
      this._providerRepository.getProviderDetailsById(providerId),
      this._providerRepository.isProviderBlocked(providerId)
    ]);

    if (!provider) {
      throw new NotFoundError(AIRCRAFT_MESSAGES.PROVIDER_NOT_FOUND);
    }

    if (isBlocked) {
      throw new ForbiddenError(AUTH_MESSAGES.ACCOUNT_BLOCKED);
    }

    if (!provider.isVerified) {
      throw new ForbiddenError(AUTH_MESSAGES.ACCOUNT_NOT_VERIFIED);
    }
  }

 private async validateOwnershipAndStatus(aircraftId: string, providerId: string): Promise<IAircraft> {
  const aircraft = await this._aircraftRepository.getAircraftById(aircraftId);
  if (!aircraft) throw new NotFoundError(AIRCRAFT_MESSAGES.NOT_FOUND);
  if (aircraft.providerId !== providerId)
    throw new ForbiddenError("You don't have permission to delete this aircraft");
  return aircraft;
}


 private async checkForUpcomingFlights(aircraftId: string): Promise<void> {
  const hasFlights = await this._flightRepository.hasActiveFlightsForAircraft(aircraftId);
  if (hasFlights) {
    throw new ConflictError(
      "Cannot delete aircraft with scheduled flights. Cancel or complete all flights first."
    );
  }
}

  private async checkForActiveBookings(aircraftId: string): Promise<void> {
  
  }

  private async performDeletionChecks(aircraftId: string): Promise<void> {
    await Promise.all([
      this.checkForUpcomingFlights(aircraftId),
      this.checkForActiveBookings(aircraftId)
    ]);
  }

private async verifyProviderAircraftCount(providerId: string): Promise<void> {
  const { totalCount } = await this._aircraftRepository.findByProviderId(providerId);

  if (totalCount === 1) {
    throw new ConflictError(
      "Cannot delete your only aircraft. Providers must have at least one aircraft"
    );
  }
}


 async execute(aircraftId: string, providerId: string): Promise<AircraftDetailsDTO> {

    if (!aircraftId || !providerId) {
      throw new validationError(APPLICATION_MESSAGES.ALL_FIELDS_ARE_REQUIRED);
    }

    if (!aircraftId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new validationError("Invalid aircraft ID format");
    }

    const [aircraft] = await Promise.all([
      this.validateOwnershipAndStatus(aircraftId, providerId),
      this.validateProvider(providerId),
      this.verifyProviderAircraftCount(providerId)
    ]);

    await this.performDeletionChecks(aircraftId);

    await Promise.all([
      this._seatRepository.deleteSeatsByAircraftId(aircraftId),
      this._seatLayoutRepository.deleteSeatLayoutsByAircraftId(aircraftId),
    
    ]);


  const deleted = await this._aircraftRepository.deleteAircraft(aircraftId);
  if (!deleted) throw new NotFoundError(AIRCRAFT_MESSAGES.NOT_FOUND);

  return AircraftMapper.toAircraftDTO(aircraft);
  }
}
