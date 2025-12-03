import { SeatTypeDTO } from "@application/dtos/seat-dtos";

export interface IGetAllSeatTypesUseCase {
  execute(): Promise<SeatTypeDTO[]>;
}
