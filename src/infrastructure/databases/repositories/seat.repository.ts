import { ISeat } from "@domain/entities/seat.entity";
import SeatModel from "@infrastructure/databases/models/seat.model";
import { Model } from "mongoose";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { ISeatRepository } from "@domain/interfaces/ISeatRepository";
import { SeatDetailsDTO, CreateSeatDTO, UpdateSeatDTO } from "@application/dtos/seat-dtos";

export class SeatRepository
  extends BaseRepository<ISeat>
  implements ISeatRepository
{
  constructor(model: Model<ISeat> = SeatModel) {
    super(model);
  }

  async createSeats(seats: CreateSeatDTO[]): Promise<SeatDetailsDTO[]> {
    const createdSeats = await this.model.insertMany(seats);
    const seatIds = createdSeats.map(seat => seat._id);
    return await this.getSeatsByIds(seatIds);
  }

  private async getSeatsByIds(seatIds: string[]): Promise<SeatDetailsDTO[]> {
    const seatsData = await this.model.aggregate([
      {
        $match: {
          _id: { $in: seatIds.map(id => this.parseId(id)) }
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
      {
        $unwind: {
          path: "$seatType",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          aircraftId: 1,
          seatTypeId: 1,
          seatTypeName: "$seatType.seatTypeName",
          cabinClass: "$seatType.cabinClass",
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
    return seatsData;
  }

  

  async getSeatsByAircraftId(aircraftId: string): Promise<SeatDetailsDTO[]> {
    const seatsData = await this.model.aggregate([
      {
        $match: {
          aircraftId: aircraftId
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
      {
        $unwind: {
          path: "$seatType",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          aircraftId: 1,
          seatTypeId: 1,
          seatTypeName: "$seatType.seatTypeName",
          cabinClass: "$seatType.cabinClass",
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
    return seatsData;
  }


  // need to use in flights....!!

  async getSeatById(seatId: string): Promise<SeatDetailsDTO | null> {
    const seatData = await this.model.aggregate([
      {
        $match: {
          _id: this.parseId(seatId)
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
      {
        $unwind: {
          path: "$seatType",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          aircraftId: 1,
          seatTypeId: 1,
          seatTypeName: "$seatType.seatTypeName",
          cabinClass: "$seatType.cabinClass",
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
    return seatData.length > 0 ? seatData[0] : null;
  }

  async updateSeat(seatId: string, data: UpdateSeatDTO): Promise<SeatDetailsDTO | null> {
    const updatedSeat = await this.model.findByIdAndUpdate(
      seatId,
      data,
      { new: true }
    ).exec();
    
    if (!updatedSeat) return null;
    return await this.getSeatById(updatedSeat._id);
  }

  async blockSeat(seatId: string, reason: string): Promise<boolean> {
    const result = await this.model.findByIdAndUpdate(
      seatId,
      { isBlocked: true, blockReason: reason },
      { new: true }
    ).exec();
    return result !== null;
  }

  async unblockSeat(seatId: string): Promise<boolean> {
    const result = await this.model.findByIdAndUpdate(
      seatId,
      { isBlocked: false, blockReason: "" },
      { new: true }
    ).exec();
    return result !== null;
  }

  async deleteSeats(aircraftId: string): Promise<boolean> {
    const result = await this.model.deleteMany({ aircraftId }).exec();
    return result.deletedCount > 0;
  }

  async getSeatsByClass(aircraftId: string, seatTypeId: string): Promise<SeatDetailsDTO[]> {
    const seatsData = await this.model.aggregate([
      {
        $match: {
          aircraftId: aircraftId,
          seatTypeId: seatTypeId
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
      {
        $unwind: {
          path: "$seatType",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          aircraftId: 1,
          seatTypeId: 1,
          seatTypeName: "$seatType.seatTypeName",
          cabinClass: "$seatType.cabinClass",
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
    return seatsData;
  }

  async getAvailableSeats(aircraftId: string): Promise<SeatDetailsDTO[]> {
    const seatsData = await this.model.aggregate([
      {
        $match: {
          aircraftId: aircraftId,
          isBlocked: false
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
      {
        $unwind: {
          path: "$seatType",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          aircraftId: 1,
          seatTypeId: 1,
          seatTypeName: "$seatType.seatTypeName",
          cabinClass: "$seatType.cabinClass",
          seatNumber: 1,
          rowNumber: 1,
          columnPosition: 1,
          section: 1,
          position: 1,
          isExitRow: 1,
          isBlocked: 1,
          features: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    ]).sort({ rowNumber: 1, columnPosition: 1 });
    return seatsData;
  }
}
