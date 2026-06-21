import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_BOOKING_USECASES } from "@di/types-usecases";
import { IUpdateBookingSegmentUseCase } from "@di/file-imports-index";
import { UpdateBookingSegmentDTO } from "@application/dtos/booking-dtos";
import { BOOKING_MESSAGES } from "@shared/constants/bookingMessages/booking.messages";
import { validationError } from "@presentation/middlewares/error.middleware";

@injectable()
export class UpdateBookingSegmentController {
  constructor(
    @inject(TYPES_BOOKING_USECASES.UpdateBookingSegmentUseCase)
    private _updateBookingSegmentUseCase: IUpdateBookingSegmentUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { sessionId } = req.params;
    const { passengerCount, removeFlightId } = req.body;

    const data: UpdateBookingSegmentDTO = {
      ...(passengerCount !== undefined && { passengerCount: Number(passengerCount) }),
      ...(removeFlightId && { removeFlightId }),
    };

       if (!sessionId) {
        throw new validationError(BOOKING_MESSAGES.SESSION_ID_REQUIRED);
      }
        
    const result = await this._updateBookingSegmentUseCase.execute(
      userId,
      sessionId,
      data
    );

    sendResponse(
      res,
      BOOKING_MESSAGES.SEGMENT_UPDATED,
      result,
      StatusCodes.OK
    );
  }
}