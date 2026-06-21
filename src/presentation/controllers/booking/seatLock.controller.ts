import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_BOOKING_USECASES } from "@di/types-usecases";
import { ISeatLockUseCase } from "@di/file-imports-index";
import { SeatLockDTO } from "@application/dtos/booking-dtos";
import { BOOKING_MESSAGES } from "@shared/constants/bookingMessages/booking.messages";

@injectable()
export class SeatLockController {
  constructor(
    @inject(TYPES_BOOKING_USECASES.SeatLockUseCase)
    private _seatLockUseCase: ISeatLockUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { sessionId } = req.params;
    const { flightId, flightSeatId, passengerId } = req.body;

    const data: SeatLockDTO = {
      flightId,
      flightSeatId,
      passengerId,
    };
    if(!sessionId){
        throw new Error(BOOKING_MESSAGES.SESSION_ID_REQUIRED);
    }

    const result = await this._seatLockUseCase.execute(
      userId,
      sessionId,
      data
    );

    sendResponse(
      res,
      BOOKING_MESSAGES.SEAT_LOCKED,
      result,
      StatusCodes.OK
    );
  }
}