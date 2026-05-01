import { ISeatType } from "@domain/entities/seatType.entity"
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";


export interface ISeatTypeRepository extends IBaseRepository<ISeatType> {
  getAllSeatTypes(): Promise<ISeatType[]>;
  getSeatTypeById(seatTypeId: string): Promise<ISeatType | null>;
  getSeatTypeByClass(cabinClass: string): Promise<ISeatType | null>;
}
