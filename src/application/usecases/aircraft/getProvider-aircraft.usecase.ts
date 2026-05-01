import { 
  IAircraftRepository, 
  IProviderRepository 
} from "@di/file-imports-index";
import { AircraftDetailsDTO } from "@application/dtos/aircraft-dtos";
import { AUTH_MESSAGES, APPLICATION_MESSAGES } from "@shared/constants/index.constants";
import { validationError, NotFoundError, ForbiddenError } from "@presentation/middlewares/error.middleware";
import { inject, injectable } from "inversify";
import { TYPES_REPOSITORIES, TYPES_AIRCRAFT_REPOSITORIES } from "@di/types-repositories";
import { IGetProviderAircraftsUseCase } from "@di/file-imports-index";
import { AircraftMapper } from "@application/mappers/aircraftMapper";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { IAircraft } from "@domain/entities/aircraft.entity";

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
    if (!provider) throw new NotFoundError("Provider not found");
    if (isBlocked) throw new ForbiddenError(AUTH_MESSAGES.ACCOUNT_BLOCKED);
    if (!provider.isVerified) throw new ForbiddenError(AUTH_MESSAGES.ACCOUNT_NOT_VERIFIED);
  }

  private sortAircraftsByStatus(aircrafts: IAircraft[]): IAircraft[] {
    const statusOrder = { active: 1, maintenance: 2, inactive: 3 };
    return [...aircrafts].sort((a, b) => {
      const statusComparison = statusOrder[a.status] - statusOrder[b.status];
      if (statusComparison !== 0) return statusComparison;
      return a.aircraftName.localeCompare(b.aircraftName);
    });
  }

  async execute(
    providerId: string,
    page: number = 1,
    limit: number = 4
  ): Promise<{
    aircraftsList: AircraftDetailsDTO[];
    paginationData: PaginationDTO;
  }> {
    if (!providerId) {
      throw new validationError(APPLICATION_MESSAGES.ALL_FIELDS_ARE_REQUIRED);
    }

    await this.validateProvider(providerId);
     const result =await this._aircraftRepository.findByProviderId(providerId, page, limit);
    const { aircrafts, totalPages, currentPage } = result
      

    if (aircrafts.length === 0) {
      return {
        aircraftsList: [],
        paginationData: { totalPages: 0, currentPage: page },
      };
    }

    const sorted = this.sortAircraftsByStatus(aircrafts);

    return {
      aircraftsList: AircraftMapper.toAircraftDTOs(sorted),
      paginationData: { totalPages, currentPage },
    };
  }
}