import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { FLIGHT_MESSAGES } from "@shared/constants/flightMessages/flight.messges";
import { TYPES_FLIGHT_USECASES } from "@di/types-usecases";
import { IGetFlightSeatsUseCase } from "@di/file-imports-index";

@injectable()
export class GetFlightSeatsController {
  constructor(
    @inject(TYPES_FLIGHT_USECASES.GetFlightSeatsUseCase)
    private _getFlightSeatsUseCase: IGetFlightSeatsUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { flightId } = req.params;
    
      const providerId = req.user!._id;

      if (!flightId) {
        sendResponse(res, FLIGHT_MESSAGES.ID_REQUIRED, null, StatusCodes.BAD_REQUEST);
        return;
      }

      const seatMap = await this._getFlightSeatsUseCase.execute(flightId,providerId,"provider");

      sendResponse(
        res,
        FLIGHT_MESSAGES.SEATS_RETRIEVED,
        seatMap,
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