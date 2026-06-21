import { SaveBookingDetailsDTO, BookingDetailsCacheDTO } from "@application/dtos/booking-dtos";

export interface IBookingDetailsUseCase {
  execute(userId: string, sessionId: string, data: SaveBookingDetailsDTO): Promise<BookingDetailsCacheDTO>;
}