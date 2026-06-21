import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_BOOKING_USECASES } from "@di/types-usecases";
import { IGetBookingSeatsMapUseCase } from "@di/file-imports-index";
import { BOOKING_MESSAGES } from "@shared/constants/bookingMessages/booking.messages";

@injectable()
export class GetBookingSeatsMapController {
  constructor(
    @inject(TYPES_BOOKING_USECASES.GetBookingSeatsMapUseCase)
    private _getBookingSeatsMapUseCase: IGetBookingSeatsMapUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { sessionId } = req.params;
    
    if(!sessionId){
        throw new Error(BOOKING_MESSAGES.SESSION_ID_REQUIRED);
    }

    const result = await this._getBookingSeatsMapUseCase.execute(
      userId,
      sessionId
    );

    sendResponse(
      res,
      BOOKING_MESSAGES.SEATS_MAP_RETRIEVED,
      result,
      StatusCodes.OK
    );
  }
}