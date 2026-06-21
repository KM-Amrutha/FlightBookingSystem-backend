import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_BOOKING_USECASES } from "@di/types-usecases";
import { ICancelPassengerUseCase } from "@di/file-imports-index";
import { BOOKING_MESSAGES } from "@shared/constants/bookingMessages/booking.messages";
import { TICKET_MESSAGES } from "@shared/constants/ticketMessages/ticket.messages";

@injectable()
export class CancelPassengerController {
  constructor(
    @inject(TYPES_BOOKING_USECASES.CancelPassengerUseCase)
    private readonly _cancelPassengerUseCase: ICancelPassengerUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { bookingId, passengerId } = req.params;

    if(!bookingId){
        throw new Error(BOOKING_MESSAGES.BOOKING_ID_REQUIRED);
    }
    if(!passengerId){
        throw new Error(TICKET_MESSAGES.PASSENGER_ID_REQUIRED);
    }

    const result = await this._cancelPassengerUseCase.execute(
      userId,
      bookingId,
      passengerId
    );

    sendResponse(res, BOOKING_MESSAGES.PASSENGER_CANCELLED, result, StatusCodes.OK);
  }
}