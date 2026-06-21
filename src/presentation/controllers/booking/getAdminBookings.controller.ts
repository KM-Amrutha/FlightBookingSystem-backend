import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_BOOKING_USECASES } from "@di/types-usecases";
import { IGetAdminBookingsUseCase } from "@di/file-imports-index";
import { BOOKING_MESSAGES } from "@shared/constants/bookingMessages/booking.messages";
import { parseQueryParams } from "@shared/utils/parse-queryParams";

@injectable()
export class GetAdminBookingsController {
  constructor(
    @inject(TYPES_BOOKING_USECASES.GetAdminBookingsUseCase)
    private readonly _getAdminBookingsUseCase: IGetAdminBookingsUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { page, limit } = parseQueryParams(req.query);

    const { bookingsList, paginationData } =
      await this._getAdminBookingsUseCase.execute(page, limit);

    sendResponse(
      res,
      BOOKING_MESSAGES.BOOKING_CONFIRMED,
      { data: bookingsList, pagination: paginationData },
      StatusCodes.OK
    );
  }
}