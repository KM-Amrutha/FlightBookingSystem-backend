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

  async createFlightSeats(seats: Partial<IFlightSeat>[]): Promise<IFlightSeat[]> {
    const created = await FlightSeatModel.insertMany(seats);
    const ids = created.map((s) => s._id.toString());
    const seatsData = await FlightSeatModel.find({
      _id: { $in: ids.map((id) => this.parseId(id)) }
    })
      .sort({ rowNumber: 1, columnPosition: 1 })
      .lean()
      .exec();
    return seatsData.map((s) => ({ ...s, id: s._id.toString() })) as IFlightSeat[];
  }

  async getFlightSeatsByFlightId(flightId: string): Promise<IFlightSeat[]> {
    const seatsData = await FlightSeatModel.find({ flightId })
      .sort({ rowNumber: 1, columnPosition: 1 })
      .lean()
      .exec();
    return seatsData.map((s) => ({ ...s, id: s._id.toString() })) as IFlightSeat[];
  }

  async getFlightSeatsByClass(
    flightId: string,
    cabinClass: string
  ): Promise<IFlightSeat[]> {
    const seatsData = await FlightSeatModel.find({ flightId, cabinClass })
      .sort({ rowNumber: 1, columnPosition: 1 })
      .lean()
      .exec();
    return seatsData.map((s) => ({ ...s, id: s._id.toString() })) as IFlightSeat[];
  }

  async getFlightSeatById(flightSeatId: string): Promise<IFlightSeat | null> {
    const seat = await FlightSeatModel.findById(flightSeatId).lean().exec();
    if (!seat) return null;
    return { ...seat, id: seat._id.toString() } as IFlightSeat;
  }

  async lockSeat(
    flightSeatId: string,
    userId: string,
    lockedUntil: Date
  ): Promise<IFlightSeat | null> {
    const seat = await FlightSeatModel.findOneAndUpdate(
      {
        _id: this.parseId(flightSeatId),
        isBooked: false,
        isBlocked: false,
        isLocked: false
      },
      {
        isLocked: true,
        lockedByUserId: userId,
        lockedUntil
      },
      { new: true }
    )
      .lean()
      .exec();
    if (!seat) return null;
    return { ...seat, id: seat._id.toString() } as IFlightSeat;
  }

  async unlockSeat(flightSeatId: string): Promise<IFlightSeat | null> {
    const seat = await FlightSeatModel.findByIdAndUpdate(
      flightSeatId,
      {
        isLocked: false,
        $unset: { lockedByUserId: "", lockedUntil: "" }
      },
      { new: true }
    )
      .lean()
      .exec();
    if (!seat) return null;
    return { ...seat, id: seat._id.toString() } as IFlightSeat;
  }

  async bookSeat(
    flightSeatId: string,
    bookingId: string
  ): Promise<IFlightSeat | null> {
    const seat = await FlightSeatModel.findByIdAndUpdate(
      flightSeatId,
      {
        isBooked: true,
        isLocked: false,
        bookingId,
        $unset: { lockedByUserId: "", lockedUntil: "" }
      },
      { new: true }
    )
      .lean()
      .exec();
    if (!seat) return null;
    return { ...seat, id: seat._id.toString() } as IFlightSeat;
  }

  async releaseSeat(flightSeatId: string): Promise<IFlightSeat | null> {
    const seat = await FlightSeatModel.findByIdAndUpdate(
      flightSeatId,
      {
        isBooked: false,
        isLocked: false,
        $unset: { bookingId: "", lockedByUserId: "", lockedUntil: "" }
      },
      { new: true }
    )
      .lean()
      .exec();
    if (!seat) return null;
    return { ...seat, id: seat._id.toString() } as IFlightSeat;
  }

  async releaseStaleLockes(): Promise<number> {
    const result = await FlightSeatModel.updateMany(
      {
        isLocked: true,
        lockedUntil: { $lt: new Date() }
      },
      {
        isLocked: false,
        $unset: { lockedByUserId: "", lockedUntil: "" }
      }
    ).exec();
    return result.modifiedCount;
  }

  async isSeatAvailable(flightSeatId: string): Promise<boolean> {
    const seat = await FlightSeatModel.findOne({
      _id: this.parseId(flightSeatId),
      isBooked: false,
      isBlocked: false,
      isLocked: false
    })
      .select("_id")
      .lean()
      .exec();
    return !!seat;
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
      isLocked: false
    }).exec();
  }

  async deleteFlightSeatsByFlightId(flightId: string): Promise<void> {
    await FlightSeatModel.deleteMany({ flightId }).exec();
  }
}