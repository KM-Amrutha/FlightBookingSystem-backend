import { BookingSegmentResponseDTO, UpdateBookingSegmentDTO } from "@application/dtos/booking-dtos";

export interface IUpdateBookingSegmentUseCase {
  execute(userId: string, sessionId: string, data: UpdateBookingSegmentDTO): Promise<BookingSegmentResponseDTO| null>;
}