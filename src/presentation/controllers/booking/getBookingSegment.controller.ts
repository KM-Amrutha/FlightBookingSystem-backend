import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_BOOKING_USECASES } from "@di/types-usecases";
import { IGetBookingSegmentUseCase } from "@di/file-imports-index";
import { validationError } from "@presentation/middlewares/error.middleware";
import {BOOKING_MESSAGES} from "@shared/constants/bookingMessages/booking.messages";

@injectable()
export class GetBookingSegmentController {
  constructor(
    @inject(TYPES_BOOKING_USECASES.GetBookingSegmentUseCase)
    private _getBookingSegmentUseCase: IGetBookingSegmentUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { sessionId } = req.params;
      if (!sessionId) {
    throw new validationError(BOOKING_MESSAGES.SESSION_ID_REQUIRED);
  }
    

    const result = await this._getBookingSegmentUseCase.execute(userId, sessionId);

    sendResponse(
      res,
      BOOKING_MESSAGES.SEGMENT_RETRIEVED,
      result,
      StatusCodes.OK
    );
  }
}