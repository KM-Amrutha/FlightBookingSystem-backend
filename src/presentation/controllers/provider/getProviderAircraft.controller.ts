import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_ARICRAFT_USECASES } from "@di/types-usecases";
import { IGetProviderAircraftsUseCase } from "@di/file-imports-index";

@injectable()
export class GetProviderAircraftsController {
  constructor(
    @inject(TYPES_ARICRAFT_USECASES.GetAircraftsUseCase)
    private _getProviderAircraftsUseCase: IGetProviderAircraftsUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const providerId = (req as any).user._id;

      const aircrafts = await this._getProviderAircraftsUseCase.execute(providerId);

      sendResponse(
        res,
        "Aircrafts retrieved successfully",
        aircrafts,
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
