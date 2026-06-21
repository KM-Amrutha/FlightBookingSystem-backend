import { AddFlightToSegmentDTO, BookingSegmentResponseDTO } from "@application/dtos/booking-dtos";

export interface IAddFlightToSegmentUseCase {
  execute(userId: string, data: AddFlightToSegmentDTO): Promise<BookingSegmentResponseDTO>;
}