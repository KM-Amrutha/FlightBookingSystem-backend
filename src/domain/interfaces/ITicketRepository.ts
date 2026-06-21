import { ITicket } from "@domain/entities/ticket.entity";

export interface ITicketRepository {
  createTicket(data: Partial<ITicket>): Promise<ITicket>;
  getTicketsByBookingId(bookingId: string): Promise<ITicket[]>;
  getTicketByUserId(userId: string): Promise<ITicket[]>;
}