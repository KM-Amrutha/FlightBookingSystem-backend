import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_ADMIN_USECASES } from "@di/types-usecases";
import { ISetProviderCommissionUseCase } from "@di/file-imports-index";
import { validationError } from "@presentation/middlewares/error.middleware";

@injectable()
export class SetProviderCommissionController {
  constructor(
    @inject(TYPES_ADMIN_USECASES.SetProviderCommissionUseCase)
    private readonly _setProviderCommissionUseCase: ISetProviderCommissionUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { providerId } = req.params;
    const { commissionRate } = req.body;

    if (commissionRate === undefined || commissionRate === null) {
      throw new validationError("Commission rate is required");
    }
    if(!providerId){
        throw new Error()
    }

    await this._setProviderCommissionUseCase.execute(
      providerId,
      Number(commissionRate)
    );

    sendResponse(res, "Commission rate updated successfully", null, StatusCodes.OK);
  }
}