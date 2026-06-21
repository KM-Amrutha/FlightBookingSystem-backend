import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_ADMIN_USECASES } from "@di/types-usecases";
import { IGetAdminWalletUseCase } from "@di/file-imports-index";

@injectable()
export class GetAdminWalletController {
  constructor(
    @inject(TYPES_ADMIN_USECASES.GetAdminWalletUseCase)
    private readonly _getAdminWalletUseCase: IGetAdminWalletUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const result = await this._getAdminWalletUseCase.execute();
    sendResponse(res, "Admin wallet retrieved successfully", result, StatusCodes.OK);
  }
}