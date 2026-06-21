import { inject, injectable } from "inversify";
import { ITicketRepository } from "@domain/interfaces/ITicketRepository";
import { IBookingRepository } from "@domain/interfaces/IBookingRepository";
import { IGetTicketUseCase } from "@di/file-imports-index";
import { TicketResponseDTO } from "@application/dtos/ticket-dtos";
import { TicketMapper } from "@application/mappers/ticketMapper";
import {
  NotFoundError,
  ForbiddenError,
  validationError,
} from "@presentation/middlewares/error.middleware";
import { TYPES_BOOKING_REPOSITORIES } from "@di/types-repositories";
import { BOOKING_MESSAGES } from "@shared/constants/bookingMessages/booking.messages";
import { TICKET_MESSAGES } from "@shared/constants/ticketMessages/ticket.messages";

@injectable()
export class GetTicketUseCase implements IGetTicketUseCase {
  constructor(
    @inject(TYPES_BOOKING_REPOSITORIES.TicketRepository)
    private readonly _ticketRepository: ITicketRepository,

    @inject(TYPES_BOOKING_REPOSITORIES.BookingRepository)
    private readonly _bookingRepository: IBookingRepository
  ) {}

  async execute(
    userId: string,
    bookingId: string
  ): Promise<TicketResponseDTO[]> {
    if (!bookingId) {
      throw new validationError(BOOKING_MESSAGES.BOOKING_ID_REQUIRED);
    }

    const booking = await this._bookingRepository.getBookingById(bookingId);
    if (!booking) throw new NotFoundError(BOOKING_MESSAGES.BOOKING_NOT_FOUND);

    if (booking.userId.toString() !== userId.toString()) {
      throw new ForbiddenError(BOOKING_MESSAGES.SESSION_INVALID);
    }

    if (booking.status !== "confirmed") {
      throw new validationError(TICKET_MESSAGES.TICKET_BOOKING_NOT_CONFIRMED);
    }

    const tickets = await this._ticketRepository.getTicketsByBookingId(
      bookingId
    );
    if (!tickets.length)
      throw new NotFoundError(TICKET_MESSAGES.TICKET_NOT_FOUND);

    return TicketMapper.toTicketResponseDTOs(tickets);
  }
}