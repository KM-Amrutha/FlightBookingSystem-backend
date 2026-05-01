import { ISeatType } from "@domain/entities/seatType.entity";
import SeatTypeModel from "@infrastructure/databases/models/seatType.model";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { ISeatTypeRepository } from "@domain/interfaces/ISeatTypeRepository";


export class SeatTypeRepository
  extends BaseRepository<ISeatType>
  implements ISeatTypeRepository
{
  constructor() {
    super(SeatTypeModel);
  }

  async getAllSeatTypes(): Promise<ISeatType[]> {
    const seatTypesData = await SeatTypeModel.aggregate([
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
   return seatTypesData.map((s) => ({ ...s, id: s._id.toString() }));
    
  }

  // need to use all in flight

  async getSeatTypeById(seatTypeId: string): Promise<ISeatType | null> {
    const seatTypeData = await SeatTypeModel.aggregate([
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
  
    if (!seatTypeData[0]) return null;
  return { ...seatTypeData[0], id: seatTypeData[0]._id.toString() };
  }

  async getSeatTypeByClass(cabinClass: string): Promise<ISeatType | null> {
    const seatTypeData = await SeatTypeModel.aggregate([
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
    if (!seatTypeData[0]) return null;
  return { ...seatTypeData[0], id: seatTypeData[0]._id.toString() };
  }
}
