import { ISeatLayout } from "@domain/entities/seatLayout.entity";
import SeatLayoutModel from "@infrastructure/databases/models/seatLayout.model";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { ISeatLayoutRepository } from "@domain/interfaces/ISeatLayoutRepository";

export class SeatLayoutRepository
  extends BaseRepository<ISeatLayout>
  implements ISeatLayoutRepository
{
  constructor() {
    super(SeatLayoutModel);
  }

  async createSeatLayout(data: Partial<ISeatLayout>): Promise<ISeatLayout> {
    const seatLayout = new SeatLayoutModel(data);
    const savedLayout = await seatLayout.save();
    const layoutDetails = await this.getSeatLayoutById(savedLayout._id.toString());
    if (!layoutDetails) throw new Error("Failed to retrieve created seat layout");
    return layoutDetails;
  }

  async getSeatLayoutById(layoutId: string): Promise<ISeatLayout | null> {
    const layoutData = await SeatLayoutModel.aggregate([
      { $match: { _id: this.parseId(layoutId) } },
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
    if (!layoutData[0]) return null;
    return { ...layoutData[0], id: layoutData[0]._id.toString() };
  }

  async getSeatLayoutsByAircraftId(aircraftId: string): Promise<ISeatLayout[]> {
    const layoutsData = await SeatLayoutModel.aggregate([
      { $match: { aircraftId } },
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
    return layoutsData.map((l) => ({ ...l, id: l._id.toString() }));
  }

  async getSeatLayoutByClass(aircraftId: string, cabinClass: string): Promise<ISeatLayout | null> {
    const layoutData = await SeatLayoutModel.aggregate([
      { $match: { aircraftId, cabinClass } },
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
    if (!layoutData[0]) return null;
    return { ...layoutData[0], id: layoutData[0]._id.toString() };
  }

  async updateSeatLayout(layoutId: string, data: Partial<ISeatLayout>): Promise<ISeatLayout | null> {
    const updatedLayout = await SeatLayoutModel.findByIdAndUpdate(
      layoutId,
      data,
      { new: true }
    ).exec();
    if (!updatedLayout) return null;
    return await this.getSeatLayoutById(updatedLayout._id.toString());
  }

  async deleteSeatLayoutsByAircraftId(aircraftId: string): Promise<boolean> {
    const result = await SeatLayoutModel.deleteMany({ aircraftId }).exec();
    return result.deletedCount > 0;
  }

  async deleteSeatLayout(layoutId: string): Promise<boolean> {
    const result = await SeatLayoutModel.findByIdAndDelete(layoutId).exec();
    return result !== null;
  }

  async findById(layoutId: string): Promise<ISeatLayout | null> {
    return await this.getSeatLayoutById(layoutId);
  }
}