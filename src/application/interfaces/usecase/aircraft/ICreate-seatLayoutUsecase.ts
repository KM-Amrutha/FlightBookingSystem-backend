import { CreateSeatLayoutDTO, SeatLayoutDetailsDTO } from "@application/dtos/seat-dtos";

export interface ICreateSeatLayoutUseCase {
  execute(providerId: string, data: CreateSeatLayoutDTO): Promise<SeatLayoutDetailsDTO>;
}
