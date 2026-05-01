import { ISeat } from "@domain/entities/seat.entity";
import SeatModel from "@infrastructure/databases/models/seat.model";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { ISeatRepository } from "@domain/interfaces/ISeatRepository";
// import { SeatDetailsDTO, CreateSeatDTO, UpdateSeatDTO } from "@application/dtos/seat-dtos";

export class SeatRepository
  extends BaseRepository<ISeat>
  implements ISeatRepository
{
  constructor() {
    super(SeatModel);
  }

  async createSeats(seats: Partial<ISeat>[]): Promise<ISeat[]> {
    const createdSeats = await SeatModel.insertMany(seats);
    const seatIds = createdSeats.map((seat) => seat._id.toString());
    return await this.getSeatsByIds(seatIds);
  }


  
  private async getSeatsByIds(seatIds: string[]): Promise<ISeat[]> {
    const seatsData = await SeatModel.aggregate([
      {
        $match: {
          _id: { $in: seatIds.map((id) => this.parseId(id)) }
        }
      },
      {
        $lookup: {
          from: "seattypes",
          localField: "seatTypeId",
          foreignField: "_id",
          as: "seatType"
        }
      },
      { $unwind: { path: "$seatType", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          aircraftId: 1,
          seatTypeId: 1,
          seatTypeName: "$seatType.seatTypeName",
          cabinClass: 1,
          seatNumber: 1,
          rowNumber: 1,
          columnPosition: 1,
          section: 1,
          position: 1,
          isExitRow: 1,
          isBlocked: 1,
          blockReason: 1,
          features: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    ]).sort({ rowNumber: 1, columnPosition: 1 });
    return seatsData.map((s) => ({ ...s, id: s._id.toString() }));
  }

  async getSeatsByAircraftId(aircraftId: string): Promise<ISeat[]> {
    const seatsData = await SeatModel.aggregate([
      { $match: { aircraftId } },
      {
        $lookup: {
          from: "seattypes",
          localField: "seatTypeId",
          foreignField: "_id",
          as: "seatType"
        }
      },
      { $unwind: { path: "$seatType", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          aircraftId: 1,
          seatTypeId: 1,
          seatTypeName: "$seatType.seatTypeName",
          cabinClass:1,
          seatNumber: 1,
          rowNumber: 1,
          columnPosition: 1,
          section: 1,
          position: 1,
          isExitRow: 1,
          isBlocked: 1,
          blockReason: 1,
          features: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    ]).sort({ rowNumber: 1, columnPosition: 1 });
    return seatsData.map((s) => ({ ...s, id: s._id.toString() }));
  }

  async getSeatById(seatId: string): Promise<ISeat | null> {
    const seatData = await SeatModel.aggregate([
      { $match: { _id: this.parseId(seatId) } },
      {
        $lookup: {
          from: "seattypes",
          localField: "seatTypeId",
          foreignField: "_id",
          as: "seatType"
        }
      },
      { $unwind: { path: "$seatType", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          aircraftId: 1,
          seatTypeId: 1,
          seatTypeName: "$seatType.seatTypeName",
          cabinClass: 1,
          seatNumber: 1,
          rowNumber: 1,
          columnPosition: 1,
          section: 1,
          position: 1,
          isExitRow: 1,
          isBlocked: 1,
          blockReason: 1,
          features: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    ]);
    if (!seatData[0]) return null;
    return { ...seatData[0], id: seatData[0]._id.toString() };
  }

  async updateSeat(seatId: string, data: Partial<ISeat>): Promise<ISeat | null> {
    const updatedSeat = await SeatModel.findByIdAndUpdate(
      seatId,
      data,
      { new: true }
    ).exec();
    if (!updatedSeat) return null;
    return await this.getSeatById(updatedSeat._id.toString());
  }

  async blockSeat(seatId: string, reason: string): Promise<boolean> {
    const result = await SeatModel.findByIdAndUpdate(
      seatId,
      { isBlocked: true, blockReason: reason },
      { new: true }
    ).exec();
    return result !== null;
  }

  async unblockSeat(seatId: string): Promise<boolean> {
    const result = await SeatModel.findByIdAndUpdate(
      seatId,
      { isBlocked: false, blockReason: "" },
      { new: true }
    ).exec();
    return result !== null;
  }

  async deleteSeatsByAircraftId(aircraftId: string): Promise<boolean> {
    const result = await SeatModel.deleteMany({ aircraftId }).exec();
    return result.deletedCount > 0;
  }

  async deleteSeatsByRowRange(aircraftId: string,startRow: number,endRow: number): Promise<boolean> {
  const result = await SeatModel.deleteMany({
    aircraftId,
    rowNumber: { $gte: startRow, $lte: endRow }
  }).exec();
  return result.deletedCount > 0;
}

  async getSeatsByClass(aircraftId: string, seatTypeId: string): Promise<ISeat[]> {
    const seatsData = await SeatModel.aggregate([
      { $match: { aircraftId, seatTypeId } },
      {
        $lookup: {
          from: "seattypes",
          localField: "seatTypeId",
          foreignField: "_id",
          as: "seatType"
        }
      },
      { $unwind: { path: "$seatType", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          aircraftId: 1,
          seatTypeId: 1,
          seatTypeName: "$seatType.seatTypeName",
          cabinClass: 1,
          seatNumber: 1,
          rowNumber: 1,
          columnPosition: 1,
          section: 1,
          position: 1,
          isExitRow: 1,
          isBlocked: 1,
          blockReason: 1,
          features: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    ]).sort({ rowNumber: 1, columnPosition: 1 });
    return seatsData.map((s) => ({ ...s, id: s._id.toString() }));
  }

  async getAvailableSeats(aircraftId: string): Promise<ISeat[]> {
    const seatsData = await SeatModel.aggregate([
      { $match: { aircraftId, isBlocked: false } },
      {
        $lookup: {
          from: "seattypes",
          localField: "seatTypeId",
          foreignField: "_id",
          as: "seatType"
        }
      },
      { $unwind: { path: "$seatType", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          aircraftId: 1,
          seatTypeId: 1,
          seatTypeName: "$seatType.seatTypeName",
          cabinClass: 1,
          seatNumber: 1,
          rowNumber: 1,
          columnPosition: 1,
          section: 1,
          position: 1,
          isExitRow: 1,
          isBlocked: 1,
          blockReason: 1,
          features: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    ]).sort({ rowNumber: 1, columnPosition: 1 });
    return seatsData.map((s) => ({ ...s, id: s._id.toString() }));
  }
}
