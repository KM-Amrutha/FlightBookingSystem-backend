import { BookingSegmentResponseDTO } from "@application/dtos/booking-dtos";

export interface IGetBookingSegmentUseCase {
  execute(userId: string, sessionId: string): Promise<BookingSegmentResponseDTO>;
}