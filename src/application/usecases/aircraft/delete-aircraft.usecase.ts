import { 
  IAircraftRepository, 
  IProviderRepository 
} from "@di/file-imports-index";
import { AircraftDetailsDTO } from "@application/dtos/aircraft-dtos";
import { AircraftStatus, AuthStatus, ApplicationStatus } from "@shared/constants/index.constants";
import { validationError, NotFoundError, ForbiddenError, ConflictError } from "@presentation/middlewares/error.middleware";
import { inject, injectable } from "inversify";
import { TYPES_REPOSITORIES, TYPES_AIRCRAFT_REPOSITORIES } from "@di/types-repositories";
import { IDeleteAircraftUseCase } from "@di/file-imports-index";

@injectable()
export class DeleteAircraftUseCase implements IDeleteAircraftUseCase {
  constructor(
    @inject(TYPES_AIRCRAFT_REPOSITORIES.AircraftRepository)
    private _aircraftRepository: IAircraftRepository,
    @inject(TYPES_REPOSITORIES.ProviderRepository)
    private _providerRepository: IProviderRepository
  ) {}

  private async validateProvider(providerId: string): Promise<void> {
    const [provider, isBlocked] = await Promise.all([
      this._providerRepository.getProviderDetailsById(providerId),
      this._providerRepository.isProviderBlocked(providerId)
    ]);

    if (!provider) {
      throw new NotFoundError(AircraftStatus.ProviderNotFound);
    }

    if (isBlocked) {
      throw new ForbiddenError(AuthStatus.AccountBlocked);
    }

    if (!provider.isVerified) {
      throw new ForbiddenError(AuthStatus.AccountNotVerified);
    }
  }

  private async validateOwnershipAndStatus(
    aircraftId: string, 
    providerId: string
  ): Promise<AircraftDetailsDTO> {
    const aircraft = await this._aircraftRepository.getAircraftById(aircraftId);
    
    if (!aircraft) {
      throw new NotFoundError(AircraftStatus.NotFound);
    }

    if (aircraft.providerId !== providerId) {
      throw new ForbiddenError("You don't have permission to delete this aircraft");
    }

    return aircraft;
  }

  private validateAircraftDeletionEligibility(aircraft: AircraftDetailsDTO): void {
    if (aircraft.status === "active") {
      throw new ConflictError(
        "Cannot delete active aircraft. Please set status to inactive first"
      );
    }

    if (aircraft.status === "maintenance") {
      throw new ConflictError(
        "Cannot delete aircraft currently under maintenance. Complete maintenance first"
      );
    }
  }

  private async checkForUpcomingFlights(aircraftId: string): Promise<void> {

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
    const providerAircrafts = await this._aircraftRepository.findByProviderId(providerId);
    
    if (providerAircrafts.length === 1) {
      throw new ConflictError(
        "Cannot delete your only aircraft. Providers must have at least one aircraft"
      );
    }
  }

 async execute(aircraftId: string, providerId: string): Promise<AircraftDetailsDTO> {

    if (!aircraftId || !providerId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }

    if (!aircraftId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new validationError("Invalid aircraft ID format");
    }

    const [aircraft] = await Promise.all([
      this.validateOwnershipAndStatus(aircraftId, providerId),
      this.validateProvider(providerId),
      this.verifyProviderAircraftCount(providerId)
    ]);

    this.validateAircraftDeletionEligibility(aircraft);

    await this.performDeletionChecks(aircraftId);

    try {
   const deletedAircraft = await this._aircraftRepository.deleteAircraft(aircraftId);

if (!deletedAircraft) {
  throw new NotFoundError(AircraftStatus.NotFound);
}

return aircraft; 


    } catch (error) {
      if (
        error instanceof validationError || 
        error instanceof NotFoundError || 
        error instanceof ForbiddenError ||
        error instanceof ConflictError
      ) {
        throw error;
      }
      throw new validationError(AircraftStatus.DeleteFailed);
    }
  }
}
