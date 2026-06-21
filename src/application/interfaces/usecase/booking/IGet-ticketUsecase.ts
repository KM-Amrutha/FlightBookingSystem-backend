import { TicketResponseDTO } from "@application/dtos/ticket-dtos";

export interface IGetTicketUseCase {
  execute(userId: string, bookingId: string): Promise<TicketResponseDTO[]>;
}