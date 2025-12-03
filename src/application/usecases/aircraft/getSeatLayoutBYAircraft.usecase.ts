import { ISeatLayoutRepository } from "@di/file-imports-index";
import { SeatLayoutDetailsDTO } from "@application/dtos/seat-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import { inject, injectable } from "inversify";
import { TYPES_AIRCRAFT_REPOSITORIES } from "@di/types-repositories";
import { IGetSeatLayoutsByAircraftUseCase } from "@di/file-imports-index";

@injectable()
export class GetSeatLayoutsByAircraftUseCase implements IGetSeatLayoutsByAircraftUseCase {
  constructor(
    @inject(TYPES_AIRCRAFT_REPOSITORIES.SeatLayoutRepository)
    private _seatLayoutRepository: ISeatLayoutRepository
  ) {}

  async execute(aircraftId: string): Promise<SeatLayoutDetailsDTO[]> {
    try {
      if (!aircraftId) {
        throw new validationError("Aircraft ID is required");
      }

      const seatLayouts = await this._seatLayoutRepository.getSeatLayoutsByAircraftId(aircraftId);

      if (!seatLayouts || seatLayouts.length === 0) {
        return []; // Return empty array, no error
      }

      return seatLayouts;
    } catch (error) {
      if (error instanceof validationError) {
        throw error;
      }
      throw new validationError("Failed to retrieve seat layouts");
    }
  }
}
