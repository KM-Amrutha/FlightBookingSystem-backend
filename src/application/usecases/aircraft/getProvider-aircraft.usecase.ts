import { 
  IAircraftRepository, 
  IProviderRepository 
} from "@di/file-imports-index";
import { AircraftDetailsDTO } from "@application/dtos/aircraft-dtos";
import { AUTH_MESSAGES, APPLICATION_MESSAGES, AIRCRAFT_MESSAGES } from "@shared/constants/index.constants";
import { validationError, NotFoundError, ForbiddenError } from "@presentation/middlewares/error.middleware";
import { inject, injectable } from "inversify";
import { TYPES_REPOSITORIES, TYPES_AIRCRAFT_REPOSITORIES } from "@di/types-repositories";
import { IGetProviderAircraftsUseCase } from "@di/file-imports-index";

@injectable()
export class GetProviderAircraftsUseCase implements IGetProviderAircraftsUseCase {
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
      throw new NotFoundError("Provider not found");
    }

    if (isBlocked) {
      throw new ForbiddenError(AUTH_MESSAGES.ACCOUNT_BLOCKED);
    }

    if (!provider.isVerified) {
      throw new ForbiddenError(AUTH_MESSAGES.ACCOUNT_NOT_VERIFIED);
    }
  }

  private sortAircraftsByStatus(aircrafts: AircraftDetailsDTO[]): AircraftDetailsDTO[] {
    const statusOrder = { active: 1, maintenance: 2, inactive: 3 };
    
    return aircrafts.sort((a, b) => {
      const statusComparison = statusOrder[a.status] - statusOrder[b.status];
      if (statusComparison !== 0) return statusComparison;
      
      return a.aircraftName.localeCompare(b.aircraftName);
    });
  }

  private validateAircraftData(aircrafts: AircraftDetailsDTO[]): void {
    if (aircrafts.length === 0) {
      throw new NotFoundError(AIRCRAFT_MESSAGES.NOT_FOUND);
    }

    aircrafts.forEach(aircraft => {
      if (!aircraft.providerId) {
        throw new validationError("Invalid aircraft data: missing provider ID");
      }
    });
  }

  async execute(providerId: string): Promise<AircraftDetailsDTO[]> {
     console.log('USE CASE CALLED with', providerId);
    if (!providerId) {
      throw new validationError(APPLICATION_MESSAGES.ALL_FIELDS_ARE_REQUIRED);
    }

    await this.validateProvider(providerId);

    try {
      const aircrafts = await this._aircraftRepository.getAircraftsByProvider(providerId);
        console.log('FIRST AIRCRAFT FROM USE CASE:', aircrafts[0]);
      if (aircrafts.length === 0) {
        return [];
      }

      this.validateAircraftData(aircrafts);
      
      const sortedAircrafts = this.sortAircraftsByStatus(aircrafts);

      return sortedAircrafts;
    } catch (error) {
      if (
        error instanceof validationError || 
        error instanceof NotFoundError || 
        error instanceof ForbiddenError
      ) {
        throw error;
      }
      throw new validationError("Failed to fetch provider aircrafts");
    }
  }
}
