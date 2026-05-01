import { IFlightRepository } from "@di/file-imports-index";
import { FlightDetailsDTO } from "@application/dtos/flight-dtos";
import { validationError, NotFoundError } from "@presentation/middlewares/error.middleware";
import { inject, injectable } from "inversify";
import { TYPES_AIRCRAFT_REPOSITORIES } from "@di/types-repositories";
import { IRejectSingleFlightUseCase } from "@di/file-imports-index";
import { FlightMapper } from "@application/mappers/flightMapper";

@injectable()
export class RejectSingleFlightUseCase implements IRejectSingleFlightUseCase {
  constructor(
    @inject(TYPES_AIRCRAFT_REPOSITORIES.FlightRepository)
    private _flightRepository: IFlightRepository
  ) {}

  async execute(flightId: string, reason: string): Promise<FlightDetailsDTO> {
    if (!flightId) {
      throw new validationError("Flight ID is required");
    }

    if (!reason || reason.trim().length < 10) {
      throw new validationError("Rejection reason must be at least 10 characters");
    }

    const flight = await this._flightRepository.getFlightDetails(flightId);
    if (!flight) throw new NotFoundError("Flight not found");

    if (flight.adminApproval.status !== "approved") {
      throw new validationError("Only approved flights can be rejected from this action");
    }

    const updated = await this._flightRepository.approveFlight(
      flightId,
      "rejected",
      reason.trim()
    );

    if (!updated) throw new NotFoundError("Failed to reject flight");

    return FlightMapper.toFlightDetailsDTO(updated);
  }
}