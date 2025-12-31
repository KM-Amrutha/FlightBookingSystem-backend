import { ISeatType } from "@domain/entities/seatType.entity";
import SeatTypeModel from "@infrastructure/databases/models/seatType.model";
import { Model } from "mongoose";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { ISeatTypeRepository } from "@domain/interfaces/ISeatTypeRepository";
import { SeatTypeDTO } from "@application/dtos/seat-dtos";

export class SeatTypeRepository
  extends BaseRepository<ISeatType>
  implements ISeatTypeRepository
{
  constructor(model: Model<ISeatType> = SeatTypeModel) {
    super(model);
  }

  async getAllSeatTypes(): Promise<SeatTypeDTO[]> {
    const seatTypesData = await this.model.aggregate([
      {
        $project: {
          _id: 1,
          seatTypeName: 1,
          cabinClass: 1,
          basePriceMultiplier: 1,
          seatPitch: 1,
          seatWidth: 1,
          features: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    ]).sort({ basePriceMultiplier: 1 });
    return seatTypesData;
  }

  // need to use all in flight

  async getSeatTypeById(seatTypeId: string): Promise<SeatTypeDTO | null> {
    const seatTypeData = await this.model.aggregate([
      {
        $match: {
          _id: this.parseId(seatTypeId)
        }
      },
      {
        $project: {
          _id: 1,
          seatTypeName: 1,
          cabinClass: 1,
          basePriceMultiplier: 1,
          seatPitch: 1,
          seatWidth: 1,
          features: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    ]);
    return seatTypeData.length > 0 ? seatTypeData[0] : null;
  }

  async getSeatTypeByClass(cabinClass: string): Promise<SeatTypeDTO | null> {
    const seatTypeData = await this.model.aggregate([
      {
        $match: {
          cabinClass: cabinClass
        }
      },
      {
        $project: {
          _id: 1,
          seatTypeName: 1,
          cabinClass: 1,
          basePriceMultiplier: 1,
          seatPitch: 1,
          seatWidth: 1,
          features: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    ]);
    return seatTypeData.length > 0 ? seatTypeData[0] : null;
  }
}
