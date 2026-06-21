import { CancelPassengerResponseDTO } from "@application/dtos/wallet-dtos";

export interface ICancelPassengerUseCase {
  execute(
    userId: string,
    bookingId: string,
    passengerId: string
  ): Promise<CancelPassengerResponseDTO>;
}