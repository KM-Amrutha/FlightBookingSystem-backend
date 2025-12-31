import { ISeatTypeRepository } from "@di/file-imports-index";
import { SeatTypeDTO } from "@application/dtos/seat-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import { inject, injectable } from "inversify";
import { TYPES_AIRCRAFT_REPOSITORIES } from "@di/types-repositories";
import { IGetAllSeatTypesUseCase } from "@di/file-imports-index";

@injectable()
export class GetAllSeatTypesUseCase implements IGetAllSeatTypesUseCase {
  constructor(
    @inject(TYPES_AIRCRAFT_REPOSITORIES.SeatTypeRepository)
    private _seatTypeRepository: ISeatTypeRepository
  ) {}

  async execute(): Promise<SeatTypeDTO[]> {
    try {
      const seatTypes = await this._seatTypeRepository.getAllSeatTypes();

      if (!seatTypes || seatTypes.length === 0) {
        throw new validationError(
          "No seat types found. Please run the seat types seeder."
        );
      }

      return seatTypes;
    } catch (error) {
      if (error instanceof validationError) {
        throw error;
      }
      throw new validationError("Failed to retrieve seat types");
    }
  }
}
