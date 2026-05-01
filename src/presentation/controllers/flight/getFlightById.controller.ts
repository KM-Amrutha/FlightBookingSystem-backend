import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_FLIGHT_USECASES } from "@di/types-usecases";
import { IGetFlightByIdUseCase } from "@di/file-imports-index";
import { FLIGHT_MESSAGES } from "@shared/constants/flightMessages/flight.messges";

@injectable()
export class GetFlightByIdController {
  constructor(
    @inject(TYPES_FLIGHT_USECASES.GetFlightByIdUseCase)
    private _getFlightByIdUseCase: IGetFlightByIdUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const providerId = req.user!._id;
      const { flightId } = req.params;

      if (!flightId) {
        sendResponse(res, FLIGHT_MESSAGES.ID_REQUIRED, null, StatusCodes.BAD_REQUEST);
        return;
      }

      const flight = await this._getFlightByIdUseCase.execute(providerId, flightId);

      sendResponse(res, FLIGHT_MESSAGES.RETRIEVED, flight, StatusCodes.OK);
    } catch (error: any) {
      sendResponse(res, error.message, null, StatusCodes.BAD_REQUEST);
    }
  }
}