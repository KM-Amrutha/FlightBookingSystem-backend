import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_AIRCRAFT_USECASES } from "@di/types-usecases";
import { IGetProviderAircraftsUseCase } from "@di/file-imports-index";
import { parseQueryParams } from "@shared/utils/parse-queryParams";

@injectable()
export class GetProviderAircraftsController {
  constructor(
    @inject(TYPES_AIRCRAFT_USECASES.GetAircraftsUseCase)
    private _getProviderAircraftsUseCase: IGetProviderAircraftsUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    
    try {
      const providerId = req.user!._id;
      const { page, limit } = parseQueryParams(req.query);

      const { aircraftsList, paginationData } =
        await this._getProviderAircraftsUseCase.execute(providerId, page, limit);

      sendResponse(
        res,
        "Aircrafts retrieved successfully",
        { data: aircraftsList, pagination: paginationData },
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