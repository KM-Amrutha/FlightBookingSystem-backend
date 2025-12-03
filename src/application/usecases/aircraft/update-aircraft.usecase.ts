import { 
  IAircraftRepository, 
  IProviderRepository,
  IDestinationRepository 
} from "@di/file-imports-index";
import { UpdateAircraftDTO, AircraftDetailsDTO } from "@application/dtos/aircraft-dtos";
import { AircraftStatus, AuthStatus, ApplicationStatus } from "@shared/constants/index.constants";
import { validationError, NotFoundError, ForbiddenError } from "@presentation/middlewares/error.middleware";
import { inject, injectable } from "inversify";
import {TYPES_REPOSITORIES, TYPES_AIRCRAFT_REPOSITORIES } from "@di/types-repositories";
import { IUpdateAircraftUseCase } from "@di/file-imports-index";

@injectable()
export class UpdateAircraftUseCase implements IUpdateAircraftUseCase {
  constructor(
    @inject(TYPES_AIRCRAFT_REPOSITORIES.AircraftRepository)
    private _aircraftRepository: IAircraftRepository,
    @inject(TYPES_REPOSITORIES.ProviderRepository)
    private _providerRepository: IProviderRepository,
    @inject(TYPES_AIRCRAFT_REPOSITORIES.DestionationRepository)
    private _destinationRepository: IDestinationRepository
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

  private async validateOwnership(aircraftId: string, providerId: string): Promise<AircraftDetailsDTO> {
    const aircraft = await this._aircraftRepository.getAircraftById(aircraftId);
    
    if (!aircraft) {
      throw new NotFoundError(AircraftStatus.NotFound);
    }

    if (aircraft.providerId !== providerId) {
      throw new ForbiddenError("You don't have permission to update this aircraft");
    }

    return aircraft;
  }

  private async validateAircraftName(
    aircraftName: string, 
    providerId: string, 
    currentAircraftId: string
  ): Promise<void> {
    const providerAircrafts = await this._aircraftRepository.findByProviderId(providerId);
    
    const nameExists = providerAircrafts.some(
      aircraft => 
        aircraft.aircraftName.toLowerCase() === aircraftName.toLowerCase() &&
        aircraft._id.toString() !== currentAircraftId
    );

    if (nameExists) {
      throw new validationError(AircraftStatus.AlreadyExists);
    }
  }

  private async validateDestination(destinationId: string): Promise<void> {
    const destination = await this._destinationRepository.findById(destinationId);
    
    if (!destination) {
      throw new NotFoundError(AircraftStatus.StationNotFound);
    }

    if (!destination.isActive) {
      throw new validationError("Selected destination is not active");
    }
  }

  private validateUpdateData(data: UpdateAircraftDTO): void {
    if (data.seatCapacity !== undefined) {
      if (data.seatCapacity <= 0) {
        throw new validationError(AircraftStatus.InvalidCapacity);
      }
      if (data.seatCapacity > 1000) {
        throw new validationError("Seat capacity cannot exceed 1000");
      }
    }

    if (data.buildYear !== undefined) {
      const currentYear = new Date().getFullYear();
      if (data.buildYear < 1900 || data.buildYear > currentYear) {
        throw new validationError(AircraftStatus.InvalidBuildYear);
      }
    }

    if (data.flyingRangeKm !== undefined && data.flyingRangeKm <= 0) {
      throw new validationError("Flying range must be greater than 0");
    }

    if (data.engineCount !== undefined && (data.engineCount < 1 || data.engineCount > 8)) {
      throw new validationError("Engine count must be between 1 and 8");
    }

    if (data.lavatoryCount !== undefined && data.lavatoryCount < 0) {
      throw new validationError("Lavatory count cannot be negative");
    }
  }

  private async performParallelValidations(
    data: UpdateAircraftDTO,
    providerId: string,
    aircraftId: string
  ): Promise<void> {
    const validationPromises: Promise<void>[] = [];

    if (data.aircraftName) {
      validationPromises.push(
        this.validateAircraftName(data.aircraftName, providerId, aircraftId)
      );
    }

    if (data.currentLocationId) {
      validationPromises.push(
        this.validateDestination(data.currentLocationId)
      );
    }

    if (data.baseStationId) {
      validationPromises.push(
        this.validateDestination(data.baseStationId)
      );
    }

    if (validationPromises.length > 0) {
      await Promise.all(validationPromises);
    }
  }

  async execute(
    aircraftId: string, 
    providerId: string, 
    data: UpdateAircraftDTO
  ): Promise<AircraftDetailsDTO> {
    if (!aircraftId || !providerId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }

    if (Object.keys(data).length === 0) {
      throw new validationError("No fields to update");
    }

    const [currentAircraft] = await Promise.all([
      this.validateOwnership(aircraftId, providerId),
      this.validateProvider(providerId)
    ]);

    if (currentAircraft.status === "maintenance") {
      throw new validationError("Cannot update aircraft while in maintenance mode");
    }

    this.validateUpdateData(data);
    await this.performParallelValidations(data, providerId, aircraftId);

    try {
      const updatedAircraft = await this._aircraftRepository.updateAircraft(aircraftId, data);
      
      if (!updatedAircraft) {
        throw new NotFoundError(AircraftStatus.NotFound);
      }

      return updatedAircraft;
    } catch (error) {
      if (
        error instanceof validationError || 
        error instanceof NotFoundError || 
        error instanceof ForbiddenError
      ) {
        throw error;
      }
      throw new validationError(AircraftStatus.UpdateFailed);
    }
  }
}
