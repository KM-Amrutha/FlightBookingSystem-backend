import { RetryPaymentResponseDTO } from "@application/dtos/booking-dtos";

export interface IRetryPaymentUseCase {
  execute(
    userId: string,
    bookingId: string
  ): Promise<RetryPaymentResponseDTO>;
}