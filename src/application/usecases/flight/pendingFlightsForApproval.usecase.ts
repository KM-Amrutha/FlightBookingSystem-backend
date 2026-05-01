import { IFlightRepository,IProviderRepository } from "@di/file-imports-index";
import { FlightListDTO } from "@application/dtos/flight-dtos"; 
import { injectable, inject } from "inversify";
import { TYPES_AIRCRAFT_REPOSITORIES,TYPES_REPOSITORIES } from "@di/types-repositories";
import { IPendingFlightsForApprovalUseCase } from "@di/file-imports-index";
import { FlightMapper } from "@application/mappers/flightMapper";

@injectable()
export class PendingFlightsForApprovalUseCase
  implements IPendingFlightsForApprovalUseCase
{
  constructor(
    @inject(TYPES_AIRCRAFT_REPOSITORIES.FlightRepository)
    private _flightRepository: IFlightRepository,
    @inject(TYPES_REPOSITORIES.ProviderRepository)
    private _providerRepository: IProviderRepository
  ) {}

async execute(): Promise<FlightListDTO[]> {
    const flights = await this._flightRepository.getPendingFlightsForApproval();

    const flightDTOs = await Promise.all(
      flights.map(async (flight) => {
        const provider = await this._providerRepository.getProviderDetailsById(flight.providerId);
        return FlightMapper.toFlightListDTO(flight, provider?.companyName);
      })
    );

    return flightDTOs;
}
}