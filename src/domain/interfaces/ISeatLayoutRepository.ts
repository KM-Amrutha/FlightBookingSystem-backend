import { IBaseRepository } from "./IBaseRepository";
import { ISeatLayout } from "@domain/entities/seatLayout.entity";

export interface ISeatLayoutRepository extends IBaseRepository<ISeatLayout> {
  createSeatLayout(data: Partial<ISeatLayout>): Promise<ISeatLayout>;
  getSeatLayoutsByAircraftId(aircraftId: string): Promise<ISeatLayout[]>;
  getSeatLayoutById(layoutId: string): Promise<ISeatLayout | null>;
  getSeatLayoutByClass(aircraftId: string, cabinClass: string): Promise<ISeatLayout | null>;
  updateSeatLayout(layoutId: string, data: Partial<ISeatLayout>): Promise<ISeatLayout | null>;
  deleteSeatLayoutsByAircraftId(aircraftId: string): Promise<boolean>;
  deleteSeatLayout(layoutId: string): Promise<boolean>;
  findById(layoutId: string): Promise<ISeatLayout | null>;
}