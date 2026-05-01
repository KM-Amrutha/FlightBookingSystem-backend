import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_FLIGHT_USECASES } from "@di/types-usecases";
import { IGetProviderFlightsUseCase } from "@di/file-imports-index";
import { FLIGHT_MESSAGES } from "@shared/constants/flightMessages/flight.messges";
import { parseQueryParams } from "@shared/utils/parse-queryParams";

@injectable()
export class GetProviderFlightsController {
  constructor(
    @inject(TYPES_FLIGHT_USECASES.GetProviderFlightsUseCase)
    private _getProviderFlightsUseCase: IGetProviderFlightsUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const providerId = req.user!._id;
 const { page, limit } = parseQueryParams(req.query);

      const {flightsList, paginationData} =
       await this._getProviderFlightsUseCase.execute(providerId, page, limit);
      

      sendResponse(
        res,
        FLIGHT_MESSAGES.RETRIEVED,
        { data: flightsList, pagination: paginationData },
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
