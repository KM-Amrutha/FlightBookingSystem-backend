import { SeatLockDTO, SeatLockResponseDTO } from "@application/dtos/booking-dtos";

export interface ISeatLockUseCase {
  execute(userId: string, sessionId: string, data: SeatLockDTO): Promise<SeatLockResponseDTO>;
}