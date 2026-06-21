import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_BOOKING_USECASES } from "@di/types-usecases";
import { IInitiateBookingUseCase } from "@di/file-imports-index";
import { BOOKING_MESSAGES } from "@shared/constants/bookingMessages/booking.messages";
import { validationError } from "@presentation/middlewares/error.middleware";

@injectable()
export class InitiateBookingController {
  constructor(
    @inject(TYPES_BOOKING_USECASES.InitiateBookingUseCase)
    private readonly _initiateBookingUseCase: IInitiateBookingUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { sessionId, offerId } = req.body;

    if (!sessionId) {
      throw new validationError(BOOKING_MESSAGES.SESSION_ID_REQUIRED);
    }

    const result = await this._initiateBookingUseCase.execute(userId, {
      sessionId,
      offerId,
    });

    sendResponse(
      res,
      BOOKING_MESSAGES.BOOKING_INITIATED,
      result,
      StatusCodes.CREATED
    );
  }
}