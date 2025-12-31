import { IFlightRepository } from "@di/file-imports-index";
import { FlightDetailsDTO } from "@application/dtos/flight-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import { inject, injectable } from "inversify";
import { TYPES_AIRCRAFT_REPOSITORIES } from "@di/types-repositories";
import { IGetProviderFlightsUseCase } from "@di/file-imports-index";

@injectable()
export class GetProviderFlightsUseCase implements IGetProviderFlightsUseCase {
  constructor(
    @inject(TYPES_AIRCRAFT_REPOSITORIES.FlightRepository)
    private _flightRepository: IFlightRepository
  ) {}

  async execute(providerId: string): Promise<FlightDetailsDTO[]> {
    if (!providerId) {
      throw new validationError("Provider ID is required");
    }

    const flights = await this._flightRepository.getFlightsByProvider(providerId);
    return flights;
  }
}
