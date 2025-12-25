import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_AIRCRAFT_USECASES } from "@di/types-usecases";
import { IGetProviderFlightsUseCase } from "@di/file-imports-index";
import { FLIGHT_MESSAGES } from "@shared/constants/flightMessages/flight.messges";

@injectable()
export class GetProviderFlightsController {
  constructor(
    @inject(TYPES_AIRCRAFT_USECASES.GetProviderFlightsUseCase)
    private _getProviderFlightsUseCase: IGetProviderFlightsUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const providerId = (req as any).user._id;

      const flights = await this._getProviderFlightsUseCase.execute(providerId);

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
        StatusCodes.BadRequest
      );
    }
  }
}
