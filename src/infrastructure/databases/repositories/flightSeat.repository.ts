import { IFlightSeat } from "@domain/entities/flightSeat.entity";
import FlightSeatModel from "@infrastructure/databases/models/flightSeat.model";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { IFlightSeatRepository } from "@domain/interfaces/IFlightSeatRepository";

export class FlightSeatRepository
  extends BaseRepository<IFlightSeat>
  implements IFlightSeatRepository
{
  constructor() {
    super(FlightSeatModel);
  }

  private baseProjection() {
    return {
      _id: 1,
      flightId: 1,
      aircraftId: 1,
      seatId: 1,
      seatNumber: 1,
      rowNumber: 1,
      columnPosition: 1,
      section: 1,
      position: 1,
      cabinClass: 1,
      isExitRow: 1,
      features: 1,
      isBooked: 1,
      isBlocked: 1,
      isLocked: 1,
      lockedByUserId: 1,
      lockedUntil: 1,
      bookingId: 1,
      createdAt: 1,
      updatedAt: 1,
    };
  }

  async createFlightSeats(seats: Partial<IFlightSeat>[]): Promise<IFlightSeat[]> {
    const created = await FlightSeatModel.insertMany(seats);
    const ids = created.map((s) => s._id.toString());

    const docs = await FlightSeatModel.aggregate([
      { $match: { _id: { $in: ids.map((id) => this.parseId(id)) } } },
      { $project: this.baseProjection() },
      { $sort: { rowNumber: 1, columnPosition: 1 } },
    ]);

    return docs.map((doc) => ({ ...doc, id: doc._id.toString() }));
  }

  async getFlightSeatsByFlightId(flightId: string): Promise<IFlightSeat[]> {
    const docs = await FlightSeatModel.aggregate([
      { $match: { flightId } },
      { $project: this.baseProjection() },
      { $sort: { rowNumber: 1, columnPosition: 1 } },
    ]);
    return docs.map((doc) => ({ ...doc, id: doc._id.toString() }));
  }

  async getFlightSeatsByClass(
    flightId: string,
    cabinClass: string
  ): Promise<IFlightSeat[]> {
    const docs = await FlightSeatModel.aggregate([
      { $match: { flightId, cabinClass } },
      { $project: this.baseProjection() },
      { $sort: { rowNumber: 1, columnPosition: 1 } },
    ]);
    return docs.map((doc) => ({ ...doc, id: doc._id.toString() }));
  }

  async getFlightSeatById(flightSeatId: string): Promise<IFlightSeat | null> {
    const docs = await FlightSeatModel.aggregate([
      { $match: { _id: this.parseId(flightSeatId) } },
      { $project: this.baseProjection() },
    ]);
    if (!docs[0]) return null;
    return { ...docs[0], id: docs[0]._id.toString() };
  }

  async lockSeat(
    flightSeatId: string,
    userId: string,
    lockedUntil: Date
  ): Promise<IFlightSeat | null> {
    const updated = await FlightSeatModel.findOneAndUpdate(
      {
        _id: this.parseId(flightSeatId),
        isBooked: false,
        isBlocked: false,
        isLocked: false,
      },
      {
        isLocked: true,
        lockedByUserId: userId,
        lockedUntil,
      },
      { new: true }
    ).exec();
    if (!updated) return null;
    return this.getFlightSeatById(updated._id.toString());
  }

  async unlockSeat(flightSeatId: string): Promise<IFlightSeat | null> {
    const updated = await FlightSeatModel.findByIdAndUpdate(
      flightSeatId,
      {
        isLocked: false,
        $unset: { lockedByUserId: "", lockedUntil: "" },
      },
      { new: true }
    ).exec();
    if (!updated) return null;
    return this.getFlightSeatById(updated._id.toString());
  }

  async bookSeat(
    flightSeatId: string,
    bookingId: string
  ): Promise<IFlightSeat | null> {
    const updated = await FlightSeatModel.findByIdAndUpdate(
      flightSeatId,
      {
        isBooked: true,
        isLocked: false,
        bookingId,
        $unset: { lockedByUserId: "", lockedUntil: "" },
      },
      { new: true }
    ).exec();
    if (!updated) return null;
    return this.getFlightSeatById(updated._id.toString());
  }

  async releaseSeat(flightSeatId: string): Promise<IFlightSeat | null> {
    const updated = await FlightSeatModel.findByIdAndUpdate(
      flightSeatId,
      {
        isBooked: false,
        isLocked: false,
        $unset: { bookingId: "", lockedByUserId: "", lockedUntil: "" },
      },
      { new: true }
    ).exec();
    if (!updated) return null;
    return this.getFlightSeatById(updated._id.toString());
  }

  async releaseStaleLockes(): Promise<number> {
    const result = await FlightSeatModel.updateMany(
      {
        isLocked: true,
        lockedUntil: { $lt: new Date() },
      },
      {
        isLocked: false,
        $unset: { lockedByUserId: "", lockedUntil: "" },
      }
    ).exec();
    return result.modifiedCount;
  }

  async isSeatAvailable(flightSeatId: string): Promise<boolean> {
    const docs = await FlightSeatModel.aggregate([
      {
        $match: {
          _id: this.parseId(flightSeatId),
          isBooked: false,
          isBlocked: false,
          isLocked: false,
        },
      },
      { $project: { _id: 1 } },
      { $limit: 1 },
    ]);
    return docs.length > 0;
  }

  async countAvailableSeats(
    flightId: string,
    cabinClass: string
  ): Promise<number> {
    return await FlightSeatModel.countDocuments({
      flightId,
      cabinClass,
      isBooked: false,
      isBlocked: false,
      isLocked: false,
    }).exec();
  }

  async deleteFlightSeatsByFlightId(flightId: string): Promise<void> {
    await FlightSeatModel.deleteMany({ flightId }).exec();
  }
}