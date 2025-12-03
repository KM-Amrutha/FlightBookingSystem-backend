import { ISeatLayout } from "@domain/entities/seatLayout.entity";
import SeatLayoutModel from "@infrastructure/databases/models/seatLayout.model";
import { Model } from "mongoose";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { ISeatLayoutRepository } from "@domain/interfaces/ISeatLayoutRepository";
import { SeatLayoutDetailsDTO, CreateSeatLayoutDTO } from "@application/dtos/seat-dtos";

export class SeatLayoutRepository
  extends BaseRepository<ISeatLayout>
  implements ISeatLayoutRepository
{
  constructor(model: Model<ISeatLayout> = SeatLayoutModel) {
    super(model);
  }
async createSeatLayout(data: CreateSeatLayoutDTO): Promise<SeatLayoutDetailsDTO> {
  const seatLayout = new this.model(data);
  const savedLayout = await seatLayout.save();
  
  const layoutDetails = await this.getSeatLayoutById(savedLayout._id);
  
  if (!layoutDetails) {
    throw new Error("Failed to retrieve created seat layout");
  }
  
  return layoutDetails;
}

  async getSeatLayoutById(layoutId: string): Promise<SeatLayoutDetailsDTO | null> {
    const layoutData = await this.model.aggregate([
      {
        $match: {
          _id: this.parseId(layoutId)
        }
      },
      {
        $project: {
          _id: 1,
          aircraftId: 1,
          cabinClass: 1,
          layout: 1,
          startRow: 1,
          endRow: 1,
          totalRows: 1,
          seatsPerRow: 1,
          columns: 1,
          aisleColumns: 1,
          exitRows: 1,
          wingStartRow: 1,
          wingEndRow: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    ]);
    return layoutData.length > 0 ? layoutData[0] : null;
  }


  async getSeatLayoutsByAircraftId(aircraftId: string): Promise<SeatLayoutDetailsDTO[]> {
    const layoutsData = await this.model.aggregate([
      {
        $match: {
          aircraftId: aircraftId
        }
      },
      {
        $project: {
          _id: 1,
          aircraftId: 1,
          cabinClass: 1,
          layout: 1,
          startRow: 1,
          endRow: 1,
          totalRows: 1,
          seatsPerRow: 1,
          columns: 1,
          aisleColumns: 1,
          exitRows: 1,
          wingStartRow: 1,
          wingEndRow: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    ]).sort({ startRow: 1 });
    return layoutsData;
  }

  // need to use it in flight

  async getSeatLayoutByClass(
    aircraftId: string,
    cabinClass: string
  ): Promise<SeatLayoutDetailsDTO | null> {
    const layoutData = await this.model.aggregate([
      {
        $match: {
          aircraftId: aircraftId,
          cabinClass: cabinClass
        }
      },
      {
        $project: {
          _id: 1,
          aircraftId: 1,
          cabinClass: 1,
          layout: 1,
          startRow: 1,
          endRow: 1,
          totalRows: 1,
          seatsPerRow: 1,
          columns: 1,
          aisleColumns: 1,
          exitRows: 1,
          wingStartRow: 1,
          wingEndRow: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    ]);
    return layoutData.length > 0 ? layoutData[0] : null;
  }

  async updateSeatLayout(
    layoutId: string,
    data: Partial<CreateSeatLayoutDTO>
  ): Promise<SeatLayoutDetailsDTO | null> {
    const updatedLayout = await this.model.findByIdAndUpdate(
      layoutId,
      data,
      { new: true }
    ).exec();
    
    if (!updatedLayout) return null;
    return await this.getSeatLayoutById(updatedLayout._id);
  }

  async deleteSeatLayouts(aircraftId: string): Promise<boolean> {
    const result = await this.model.deleteMany({ aircraftId }).exec();
    return result.deletedCount > 0;
  }

  async deleteSeatLayout(layoutId: string): Promise<boolean> {
  try {
    const result = await SeatLayoutModel.findByIdAndDelete(layoutId);
    return result !== null;
  } catch (error) {
    throw new Error(`Failed to delete seat layout: ${error}`);
  }
}
}
