import { IFlightRepository } from "@di/file-imports-index";
import { FlightDetailsDTO } from "@application/dtos/flight-dtos";
import { injectable, inject } from "inversify";
import { TYPES_AIRCRAFT_REPOSITORIES } from "@di/types-repositories";
import { IPendingFlightsForApprovalUseCase } from "@di/file-imports-index";

@injectable()
export class PendingFlightsForApprovalUseCase
  implements IPendingFlightsForApprovalUseCase
{
  constructor(
    @inject(TYPES_AIRCRAFT_REPOSITORIES.FlightRepository)
    private _flightRepository: IFlightRepository
  ) {}

  async execute(): Promise<FlightDetailsDTO[]> {
    const flights = await this._flightRepository.getPendingFlightsForApproval();
    return flights;
  }
}
