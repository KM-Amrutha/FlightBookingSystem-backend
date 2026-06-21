import { BookingSeatsMapResponseDTO } from "@application/dtos/booking-dtos";

export interface IGetBookingSeatsMapUseCase {
  execute(userId: string, sessionId: string): Promise<BookingSeatsMapResponseDTO>;
}