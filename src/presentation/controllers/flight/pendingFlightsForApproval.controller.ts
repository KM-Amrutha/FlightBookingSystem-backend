import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_FLIGHT_USECASES } from "@di/types-usecases";
import { IPendingFlightsForApprovalUseCase } from "@di/file-imports-index";
import { FLIGHT_MESSAGES } from "@shared/constants/flightMessages/flight.messges";

@injectable()
export class PendingFlightsForApprovalController {
  constructor(
    @inject(TYPES_FLIGHT_USECASES.PendingFlightsForApprovalUseCase)
    private _getPendingFlightsUseCase: IPendingFlightsForApprovalUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const flights = await this._getPendingFlightsUseCase.execute();

      sendResponse(
        res,
        FLIGHT_MESSAGES.RETRIEVED,
        flights,
        StatusCodes.OK
      );
    } catch (error: any) {
      sendResponse(
        res,
        error.message,
        null,
        StatusCodes.BAD_REQUEST
      );
    }
  }
}
