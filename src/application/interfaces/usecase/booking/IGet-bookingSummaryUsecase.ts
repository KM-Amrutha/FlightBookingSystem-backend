import { BookingSummaryResponseDTO } from "@application/dtos/booking-dtos";

export interface IGetBookingSummaryUseCase {
  execute(userId: string, sessionId: string): Promise<BookingSummaryResponseDTO>;
}