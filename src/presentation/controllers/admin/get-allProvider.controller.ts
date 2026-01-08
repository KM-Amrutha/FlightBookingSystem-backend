import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/http.status.codes";

import { GetAllProvidersUseCase } from "@di/file-imports-index";
import { TYPES_ADMIN_USECASES } from "@di/types-usecases";

@injectable()
export class GetAllProvidersController {
  constructor(
    @inject(TYPES_ADMIN_USECASES.GetAllProvidersUseCase)
    private _getAllProvidersUseCase: GetAllProvidersUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const providers = await this._getAllProvidersUseCase.execute();

      sendResponse(
        res,
        "All providers fetched successfully",
        providers,
        StatusCodes.OK
      );
    } catch (error: any) {
      sendResponse(
        res,
        error.message || "Failed to fetch providers",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}