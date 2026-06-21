import { IBooking } from "@domain/entities/booking.entity";

export interface ITicketGenerationService {
  generateTicket(booking: IBooking): Promise<void>;
}