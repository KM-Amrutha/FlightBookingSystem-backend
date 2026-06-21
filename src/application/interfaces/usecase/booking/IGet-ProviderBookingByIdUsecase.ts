import { ProviderBookingDetailResponseDTO } from "@application/dtos/booking-dtos";

export interface IGetProviderBookingByIdUseCase {
  execute(
    providerId: string,
    bookingId: string
  ): Promise<ProviderBookingDetailResponseDTO>;
}