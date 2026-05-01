import { injectable, inject } from "inversify";
import { IFlightRepository } from "@domain/interfaces/IFlightRepository";
import { IGetFlightByIdUseCase } from "@di/file-imports-index";
import { FlightDetailsDTO } from "@application/dtos/flight-dtos";
import { NotFoundError, ForbiddenError } from "@presentation/middlewares/error.middleware";
import { TYPES_AIRCRAFT_REPOSITORIES } from "@di/types-repositories";
import { FlightMapper } from "@application/mappers/flightMapper";

@injectable()
export class GetFlightByIdUseCase implements IGetFlightByIdUseCase {
  constructor(
    @inject(TYPES_AIRCRAFT_REPOSITORIES.FlightRepository)
    private _flightRepository: IFlightRepository
  ) {}

  async execute(providerId: string, flightId: string): Promise<FlightDetailsDTO> {
    const flight = await this._flightRepository.getFlightDetails(flightId);
    if (!flight) throw new NotFoundError("Flight not found");
    if (flight.providerId !== providerId) throw new ForbiddenError("You don't own this flight");
    return FlightMapper.toFlightDetailsDTO(flight);
  }
}