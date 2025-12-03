import { SeatDetailsDTO } from "@application/dtos/seat-dtos";

export interface IGenerateSeatsUseCase {
  execute(providerId: string, aircraftId: string): Promise<SeatDetailsDTO[]>;
}
