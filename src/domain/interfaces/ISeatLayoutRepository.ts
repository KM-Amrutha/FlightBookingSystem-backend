import { SeatLayoutDetailsDTO, CreateSeatLayoutDTO } from "@application/dtos/seat-dtos";

export interface ISeatLayoutRepository {
  createSeatLayout(data: CreateSeatLayoutDTO): Promise<SeatLayoutDetailsDTO>;
  getSeatLayoutsByAircraftId(aircraftId: string): Promise<SeatLayoutDetailsDTO[]>;
  getSeatLayoutById(layoutId: string): Promise<SeatLayoutDetailsDTO | null>;
  getSeatLayoutByClass(aircraftId: string, cabinClass: string): Promise<SeatLayoutDetailsDTO | null>;
  updateSeatLayout(layoutId: string, data: Partial<CreateSeatLayoutDTO>): Promise<SeatLayoutDetailsDTO | null>;
  deleteSeatLayouts(aircraftId: string): Promise<boolean>;
 deleteSeatLayout(layoutId: string): Promise<boolean>;
  findById(layoutId: string): Promise<SeatLayoutDetailsDTO | null>;
}
