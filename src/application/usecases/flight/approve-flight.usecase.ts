import { IFlightRepository } from "@di/file-imports-index";
import { ApproveFlightDTO, FlightDetailsDTO } from "@application/dtos/flight-dtos";
import { validationError, NotFoundError } from "@presentation/middlewares/error.middleware";
import { inject, injectable } from "inversify";
import { TYPES_AIRCRAFT_REPOSITORIES } from "@di/types-repositories";
import { IApproveFlightUseCase } from "@di/file-imports-index";
import { FlightMapper } from "@application/mappers/flightMapper";

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

    // ── fetch flight to know its type ────────────────────────────────────────
    const flight = await this._flightRepository.getFlightDetails(flightId);
    if (!flight) throw new NotFoundError("Flight not found");

    // ── approve/reject the main flight ───────────────────────────────────────
    const updated = await this._flightRepository.approveFlight(
      flightId,
      data.status,
      data.reason
    );
    if (!updated) throw new NotFoundError("Flight not found or approval failed");

    // ── auto approve/reject paired return flight ──────────────────────────────
    await this._flightRepository.approveReturnFlight(
      flightId,
      data.status,
      data.reason
    );

    return FlightMapper.toFlightDetailsDTO(updated);
  }
}