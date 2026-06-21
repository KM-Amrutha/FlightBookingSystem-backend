import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_BOOKING_USECASES } from "@di/types-usecases";
import { IRetryPaymentUseCase } from "@di/file-imports-index";
import { BOOKING_MESSAGES } from "@shared/constants/bookingMessages/booking.messages";
import { validationError } from "@presentation/middlewares/error.middleware";

@injectable()
export class RetryPaymentController {
  constructor(
    @inject(TYPES_BOOKING_USECASES.RetryPaymentUseCase)
    private readonly _retryPaymentUseCase: IRetryPaymentUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { bookingId } = req.params;

    if (!bookingId) {
      throw new validationError(BOOKING_MESSAGES.BOOKING_ID_REQUIRED);
    }

    const result = await this._retryPaymentUseCase.execute(userId, bookingId);

    sendResponse(
      res,
      BOOKING_MESSAGES.PAYMENT_RETRY_INITIATED,
      result,
      StatusCodes.OK
    );
  }
}