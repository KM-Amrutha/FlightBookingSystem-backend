import { IFlightRepository, IProviderRepository } from "@di/file-imports-index";
import { FlightListDTO } from "@application/dtos/flight-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import { inject, injectable } from "inversify";
import { TYPES_AIRCRAFT_REPOSITORIES, TYPES_REPOSITORIES } from "@di/types-repositories";
import { IGetAllFlightsForAdminUseCase } from "@di/file-imports-index";
import { FlightMapper } from "@application/mappers/flightMapper";

@injectable()
export class GetAllFlightsForAdminUseCase implements IGetAllFlightsForAdminUseCase {
  constructor(
    @inject(TYPES_AIRCRAFT_REPOSITORIES.FlightRepository)
    private _flightRepository: IFlightRepository,
    @inject(TYPES_REPOSITORIES.ProviderRepository)
    private _providerRepository: IProviderRepository
  ) {}

  async execute(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    flightsList: FlightListDTO[];
    paginationData: PaginationDTO;
  }> {
    if (page < 1 || limit < 1) {
      throw new validationError("Invalid pagination parameters");
    }

    const { flights, totalPages, currentPage } =
      await this._flightRepository.getAllFlightsForAdmin(page, limit);

    if (flights.length === 0) {
      return {
        flightsList: [],
        paginationData: { totalPages: 0, currentPage: page },
      };
    }

    const flightDTOs = await Promise.all(
      flights.map(async (flight) => {
        const provider = await this._providerRepository.getProviderDetailsById(
          flight.providerId
        );
        return FlightMapper.toFlightListDTO(flight, provider?.companyName);
      })
    );

    return {
      flightsList: flightDTOs,
      paginationData: { totalPages, currentPage },
    };
  }
}