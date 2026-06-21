import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_BOOKING_USECASES } from "@di/types-usecases";
import { IGetTicketUseCase } from "@di/file-imports-index";
import { TICKET_MESSAGES } from "@shared/constants/ticketMessages/ticket.messages";
import {BOOKING_MESSAGES} from "@shared/constants/bookingMessages/booking.messages";

@injectable()
export class GetTicketController {
  constructor(
    @inject(TYPES_BOOKING_USECASES.GetTicketUseCase)
    private readonly _getTicketUseCase: IGetTicketUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { bookingId } = req.params;
    if(!bookingId){
        throw new Error(BOOKING_MESSAGES.BOOKING_ID_REQUIRED);
    }

    const result = await this._getTicketUseCase.execute(userId, bookingId);

    sendResponse(res, TICKET_MESSAGES.TICKET_RETRIEVED, result, StatusCodes.OK);
  }
}