import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_BOOKING_USECASES } from "@di/types-usecases";
import { IGetBookingByIdUseCase } from "@di/file-imports-index";
import { BOOKING_MESSAGES } from "@shared/constants/bookingMessages/booking.messages";

@injectable()
export class GetBookingByIdController {
  constructor(
    @inject(TYPES_BOOKING_USECASES.GetBookingByIdUseCase)
    private readonly _getBookingByIdUseCase: IGetBookingByIdUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { bookingId } = req.params;
    console.log('controller booking id is: ',bookingId)
    if(!bookingId) {
        throw new Error(BOOKING_MESSAGES.BOOKING_ID_REQUIRED);
    }

    const result = await this._getBookingByIdUseCase.execute(userId, bookingId);

    sendResponse(res, BOOKING_MESSAGES.BOOKING_CONFIRMED, result, StatusCodes.OK);
  }
}