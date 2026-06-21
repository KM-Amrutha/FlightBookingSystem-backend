import {
  InitiateBookingDTO,
  InitiateBookingResponseDTO,
} from "@application/dtos/booking-dtos";

export interface IInitiateBookingUseCase {
  execute(
    userId: string,
    data: InitiateBookingDTO
  ): Promise<InitiateBookingResponseDTO>;
}