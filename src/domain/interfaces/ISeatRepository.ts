import { ISeat } from "@domain/entities/seat.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";

export interface ISeatRepository extends IBaseRepository<ISeat> {
  createSeats(seats: Partial<ISeat>[]): Promise<ISeat[]>;
  getSeatsByAircraftId(aircraftId: string): Promise<ISeat[]>;
  getSeatById(seatId: string): Promise<ISeat | null>;
  updateSeat(seatId: string, data: Partial<ISeat>): Promise<ISeat | null>;
  blockSeat(seatId: string, reason: string): Promise<boolean>;
  unblockSeat(seatId: string): Promise<boolean>;
  deleteSeatsByAircraftId(aircraftId: string): Promise<boolean>;
  getSeatsByClass(aircraftId: string, seatTypeId: string): Promise<ISeat[]>;
  deleteSeatsByRowRange(aircraftId: string, startRow: number, endRow: number): Promise<boolean>;
  getAvailableSeats(aircraftId: string): Promise<ISeat[]>;
}