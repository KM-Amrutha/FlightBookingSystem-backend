import { ISeatTypeRepository } from "@di/file-imports-index";
import { SeatTypeDTO } from "@application/dtos/seat-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import { inject, injectable } from "inversify";
import { TYPES_AIRCRAFT_REPOSITORIES } from "@di/types-repositories";
import { IGetAllSeatTypesUseCase } from "@di/file-imports-index";
import { SeatMapper } from "@application/mappers/seatMapper";

@injectable()
export class GetAllSeatTypesUseCase implements IGetAllSeatTypesUseCase {
  constructor(
    @inject(TYPES_AIRCRAFT_REPOSITORIES.SeatTypeRepository)
    private _seatTypeRepository: ISeatTypeRepository
  ) {}

  async execute(): Promise<SeatTypeDTO[]> {
  const seatTypes = await this._seatTypeRepository.getAllSeatTypes();

  if (!seatTypes || seatTypes.length === 0) {
    throw new validationError("No seat types found. Please run the seat types seeder.");
  }

  return SeatMapper.toSeatTypeDTOs(seatTypes); 
}
  
}
