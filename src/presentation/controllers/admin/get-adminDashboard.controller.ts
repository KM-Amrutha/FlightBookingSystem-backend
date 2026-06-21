import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_ADMIN_USECASES } from "@di/types-usecases";
import { IGetAdminDashboardUseCase } from "@application/interfaces/usecase/admin/IGetAdminDashboard.usecase";

@injectable()
export class GetAdminDashboardController {
  constructor(
    @inject(TYPES_ADMIN_USECASES.GetAdminDashboardUseCase)
    private readonly _getAdminDashboardUseCase: IGetAdminDashboardUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const result = await this._getAdminDashboardUseCase.execute();
    sendResponse(res, "Dashboard data retrieved successfully", result, StatusCodes.OK);
  }
}