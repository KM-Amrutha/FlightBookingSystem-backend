import { Request, Response } from "express";
import { injectable, inject } from "inversify";

import { IGetPendingProvidersUseCase,
          IRejectProviderUseCase,
          IVerifyProviderUseCase,
         } from "di/file-imports-index"

import { TYPES_PROVIDER_USECASES } from "@di/types-usecases";
import { StatusCodes } from "@shared/constants/http.status.codes";
import { sendResponse } from "@shared/utils/http.response"; 

@injectable()
export class ProviderVerificationController {
  constructor(
    @inject(TYPES_PROVIDER_USECASES.GetPendingProvidersUseCase)
    private _getPendingProvidersUseCase: IGetPendingProvidersUseCase,
    @inject(TYPES_PROVIDER_USECASES.VerifyProviderUseCase)
    private _verifyProviderUseCase: IVerifyProviderUseCase,
    @inject(TYPES_PROVIDER_USECASES.RejectProviderUseCase)
    private _rejectProviderUseCase: IRejectProviderUseCase
  ) {}

  async getPendingProviders(req: Request, res: Response): Promise<void> {
    try {
      const providers = await this._getPendingProvidersUseCase.execute();
      sendResponse(
        res,
        "Pending providers fetched successfully",
        providers,
        StatusCodes.OK
      );
    } catch (error: any) {
      sendResponse(
        res,
        error.message,
        null,
        StatusCodes.InternalServerError
      );
    }
  }

  async verifyProvider(req: Request, res: Response): Promise<void> {
    try {
      const { providerId } = req.params;
      
      if (!providerId) {
        sendResponse(
          res,
          "Provider ID is required",
          null,
          StatusCodes.BadRequest
        );
        return;
      }
      
      await this._verifyProviderUseCase.execute(providerId);
      sendResponse(
        res,
        "Provider verified successfully",
        null,
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

  async rejectProvider(req: Request, res: Response): Promise<void> {
    try {
      const { providerId } = req.params;
      
      if (!providerId) {
        sendResponse(
          res,
          "Provider ID is required",
          null,
          StatusCodes.BadRequest
        );
        return;
      }
      
      await this._rejectProviderUseCase.execute(providerId);
      sendResponse(
        res,
        "Provider rejected successfully",
        null,
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
