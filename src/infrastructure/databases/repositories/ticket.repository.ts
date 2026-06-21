import { ITicket } from "@domain/entities/ticket.entity";
import TicketModel from "@infrastructure/databases/models/ticket.model";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { ITicketRepository } from "@domain/interfaces/ITicketRepository";

export class TicketRepository
  extends BaseRepository<ITicket>
  implements ITicketRepository
{
  constructor() {
    super(TicketModel);
  }

  private baseProjection() {
    return {
      _id: 1,
      bookingId: 1,
      userId: 1,
      ticketNumber: 1,
      passengerIndex: 1,
      flightIndex: 1,
      issuedAt: 1,
      passenger: 1,
      flightFood: 1,
      fareBreakdown: 1,
      createdAt: 1,
      updatedAt: 1,
    };
  }

  async createTicket(data: Partial<ITicket>): Promise<ITicket> {
    const newTicket = new TicketModel(data);
    await newTicket.save();
    const tickets = await this.getTicketsByBookingId(data.bookingId!);
    const created = tickets.find(
      (t) =>
        t.passengerIndex === data.passengerIndex &&
        t.flightIndex === data.flightIndex
    );
    if (!created) throw new Error("Failed to retrieve created ticket");
    return created;
  }

  async getTicketsByBookingId(bookingId: string): Promise<ITicket[]> {
    const docs = await TicketModel.aggregate([
      { $match: { bookingId: this.parseId(bookingId) } },
      { $project: this.baseProjection() },
      { $sort: { passengerIndex: 1, flightIndex: 1 } },
    ]);
    return docs.map((doc) => ({ ...doc, id: doc._id.toString() }));
  }

  async getTicketByUserId(userId: string): Promise<ITicket[]> {
    const docs = await TicketModel.aggregate([
      { $match: { userId: this.parseId(userId) } },
      { $project: this.baseProjection() },
      { $sort: { createdAt: -1 } },
    ]);
    return docs.map((doc) => ({ ...doc, id: doc._id.toString() }));
  }
}