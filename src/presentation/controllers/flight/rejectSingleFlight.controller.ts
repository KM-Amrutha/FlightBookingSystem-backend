import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_FLIGHT_USECASES } from "@di/types-usecases";
import { IRejectSingleFlightUseCase } from "@di/file-imports-index";
import { FLIGHT_MESSAGES } from "@shared/constants/flightMessages/flight.messges";

@injectable()
export class RejectSingleFlightController {
  constructor(
    @inject(TYPES_FLIGHT_USECASES.RejectSingleFlightUseCase)
    private _rejectSingleFlightUseCase: IRejectSingleFlightUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { flightId } = req.params;

      if (!flightId) {
        sendResponse(res, FLIGHT_MESSAGES.ID_REQUIRED, null, StatusCodes.BAD_REQUEST);
        return;
      }

      const reason = req.body.reason as string | undefined;

      if (!reason) {
        sendResponse(res, "Rejection reason is required", null, StatusCodes.BAD_REQUEST);
        return;
      }

      const flight = await this._rejectSingleFlightUseCase.execute(flightId, reason);

      sendResponse(res, "Flight rejected successfully", flight, StatusCodes.OK);
    } catch (error: any) {
      sendResponse(res, error.message, null, StatusCodes.BAD_REQUEST);
    }
  }
}