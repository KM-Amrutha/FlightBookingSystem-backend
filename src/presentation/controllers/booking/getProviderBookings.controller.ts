import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_BOOKING_USECASES } from "@di/types-usecases";
import { IGetProviderBookingsUseCase } from "@di/file-imports-index";
import { BOOKING_MESSAGES } from "@shared/constants/bookingMessages/booking.messages";
import { parseQueryParams } from "@shared/utils/parse-queryParams";

@injectable()
export class GetProviderBookingsController {
  constructor(
    @inject(TYPES_BOOKING_USECASES.GetProviderBookingsUseCase)
    private readonly _getProviderBookingsUseCase: IGetProviderBookingsUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const providerId = req.user!.id;
    const { page, limit } = parseQueryParams(req.query);

    const { bookingsList, paginationData } =
      await this._getProviderBookingsUseCase.execute(providerId, page, limit);

    sendResponse(
      res,
      BOOKING_MESSAGES.BOOKING_CONFIRMED,
      { data: bookingsList, pagination: paginationData },
      StatusCodes.OK
    );
  }
}