import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_BOOKING_USECASES } from "@di/types-usecases";
import { IAddFlightToSegmentUseCase } from "@di/file-imports-index";
import { AddFlightToSegmentDTO } from "@application/dtos/booking-dtos";
import {BOOKING_MESSAGES} from "@shared/constants/bookingMessages/booking.messages"

@injectable()
export class AddFlightToSegmentController {
  constructor(
    @inject(TYPES_BOOKING_USECASES.AddFlightToSegmentUseCase)
    private _addFlightToSegmentUseCase: IAddFlightToSegmentUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
 
    const userId = req.user!.id;
    const { flightId, passengerCount, sessionId } = req.body;
  

    const data: AddFlightToSegmentDTO = {
      flightId,
      passengerCount: Number(passengerCount),
      ...(sessionId && { sessionId }),
    };

    const result = await this._addFlightToSegmentUseCase.execute(userId, data);

    sendResponse(
      res,
      BOOKING_MESSAGES.SEGMENT_ADDED,
      result,
      StatusCodes.OK
    );

  }
}