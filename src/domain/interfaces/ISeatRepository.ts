import { SeatDetailsDTO, CreateSeatDTO, UpdateSeatDTO } from "@application/dtos/seat-dtos";

export interface ISeatRepository {
  createSeats(seats: CreateSeatDTO[]): Promise<SeatDetailsDTO[]>;
  getSeatsByAircraftId(aircraftId: string): Promise<SeatDetailsDTO[]>;
  getSeatById(seatId: string): Promise<SeatDetailsDTO | null>;
  updateSeat(seatId: string, data: UpdateSeatDTO): Promise<SeatDetailsDTO | null>;
  blockSeat(seatId: string, reason: string): Promise<boolean>;
  unblockSeat(seatId: string): Promise<boolean>;
  deleteSeats(aircraftId: string): Promise<boolean>;
  getSeatsByClass(aircraftId: string, seatTypeId: string): Promise<SeatDetailsDTO[]>;
  getAvailableSeats(aircraftId: string): Promise<SeatDetailsDTO[]>;
}
