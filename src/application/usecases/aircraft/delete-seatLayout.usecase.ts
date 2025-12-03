import { 
  ISeatLayoutRepository 
} from "@di/file-imports-index";
import { SeatLayoutDetailsDTO } from "@application/dtos/seat-dtos";
import { NotFoundError, validationError } from "@presentation/middlewares/error.middleware";
import { inject, injectable } from "inversify";
import { TYPES_AIRCRAFT_REPOSITORIES } from "@di/types-repositories";
import { IDeleteSeatLayoutUseCase } from "@di/file-imports-index";

@injectable()
export class DeleteSeatLayoutUseCase implements IDeleteSeatLayoutUseCase {
  constructor(
    @inject(TYPES_AIRCRAFT_REPOSITORIES.SeatLayoutRepository) 
    private _seatLayoutRepository: ISeatLayoutRepository
  ) {}

  async execute(layoutId: string): Promise<void> {
    if (!layoutId) {
      throw new validationError("Layout ID is required");
    }

    if (!layoutId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new validationError("Invalid layout ID format");
    }

    const layout = await this._seatLayoutRepository.getSeatLayoutById(layoutId);
    
    if (!layout) {
      throw new NotFoundError('Seat layout not found');
    }

    const deleted = await this._seatLayoutRepository.deleteSeatLayout(layoutId);
    
    if (!deleted) {
      throw new NotFoundError('Failed to delete seat layout');
    }
  }
}