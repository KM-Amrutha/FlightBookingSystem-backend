import { IFlightRepository } from "@di/file-imports-index";
import { ApproveFlightDTO, FlightDetailsDTO } from "@application/dtos/flight-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import { inject, injectable } from "inversify";
import { TYPES_AIRCRAFT_REPOSITORIES } from "@di/types-repositories";
import { IApproveFlightUseCase } from "@di/file-imports-index";

@injectable()
export class ApproveFlightUseCase implements IApproveFlightUseCase {
  constructor(
    @inject(TYPES_AIRCRAFT_REPOSITORIES.FlightRepository)
    private _flightRepository: IFlightRepository
  ) {}

  async execute(flightId: string, data: ApproveFlightDTO): Promise<FlightDetailsDTO> {
    if (!flightId) {
      throw new validationError("Flight ID is required");
    }

    if (data.status === "rejected" && !data.reason) {
      throw new validationError("Rejection reason is required");
    }

    const updated = await this._flightRepository.approveFlight(flightId, data);
    if (!updated) {
      throw new validationError("Flight not found or approval failed");
    }

    return updated;
  }
}
