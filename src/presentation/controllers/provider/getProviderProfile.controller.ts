import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_PROVIDER_USECASES } from "@di/types-usecases";
import { IGetProviderProfileUseCase } from "@di/file-imports-index";

@injectable()
export class GetProviderProfileController {
  constructor(
    @inject(TYPES_PROVIDER_USECASES.GetProviderProfileUseCase)
    private _getProviderProfileUseCase: IGetProviderProfileUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const providerId = (req as any).user._id;

      const provider = await this._getProviderProfileUseCase.execute(providerId);

      sendResponse(
        res,
        "Provider profile fetched successfully",
        provider,
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
