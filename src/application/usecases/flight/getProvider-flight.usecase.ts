import { IFlightRepository, 
  IProviderRepository
 } from "@di/file-imports-index";
import { validationError, NotFoundError, ForbiddenError } from "@presentation/middlewares/error.middleware";
import { inject, injectable } from "inversify";
import { TYPES_AIRCRAFT_REPOSITORIES, TYPES_REPOSITORIES } from "@di/types-repositories";
import { IGetProviderFlightsUseCase } from "@di/file-imports-index";
import { FlightMapper } from "@application/mappers/flightMapper";
import { FlightListDTO } from "@application/dtos/flight-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { AUTH_MESSAGES, APPLICATION_MESSAGES } from "@shared/constants/index.constants";

@injectable()
export class GetProviderFlightsUseCase implements IGetProviderFlightsUseCase {
  constructor(
    @inject(TYPES_AIRCRAFT_REPOSITORIES.FlightRepository)
    private _flightRepository: IFlightRepository,
    @inject(TYPES_REPOSITORIES.ProviderRepository)
    private _providerRepository: IProviderRepository
  ) {}

  private async validateProvider(providerId: string): Promise<void> {
    const [provider, isBlocked] = await Promise.all([
      this._providerRepository.getProviderDetailsById(providerId),
      this._providerRepository.isProviderBlocked(providerId),
    ]);
    if (!provider) throw new NotFoundError("Provider not found");
    if (isBlocked) throw new ForbiddenError(AUTH_MESSAGES.ACCOUNT_BLOCKED);
    if (!provider.isVerified) throw new ForbiddenError(AUTH_MESSAGES.ACCOUNT_NOT_VERIFIED);
  }

  async execute(
    providerId: string,
    page: number = 1,
    limit: number = 4
  ): Promise<{
    flightsList: FlightListDTO[];
    paginationData: PaginationDTO;
  }> {
    if (!providerId) {
      throw new validationError(APPLICATION_MESSAGES.ALL_FIELDS_ARE_REQUIRED);
    }

    await this.validateProvider(providerId);

    const { flights, totalPages, currentPage } =
      await this._flightRepository.getFlightsByProvider(providerId, page, limit);

    if (flights.length === 0) {
      return {
        flightsList: [],
        paginationData: { totalPages: 0, currentPage: page },
      };
    }

    return {
      flightsList: FlightMapper.toFlightListDTOs(flights),
      paginationData: { totalPages, currentPage },
    };
  }
}