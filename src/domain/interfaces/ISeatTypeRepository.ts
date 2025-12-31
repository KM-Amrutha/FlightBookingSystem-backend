import { SeatTypeDTO } from "@application/dtos/seat-dtos";

export interface ISeatTypeRepository {
  getAllSeatTypes(): Promise<SeatTypeDTO[]>;
  getSeatTypeById(seatTypeId: string): Promise<SeatTypeDTO | null>;
  getSeatTypeByClass(cabinClass: string): Promise<SeatTypeDTO | null>;
}
