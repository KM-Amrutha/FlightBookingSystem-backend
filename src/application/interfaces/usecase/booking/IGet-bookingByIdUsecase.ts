import { BookingResponseDTO } from "@application/dtos/booking-dtos";

export interface IGetBookingByIdUseCase {
  execute(userId: string, bookingId: string): Promise<BookingResponseDTO>;
}