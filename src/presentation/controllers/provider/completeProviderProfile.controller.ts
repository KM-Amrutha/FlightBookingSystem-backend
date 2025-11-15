import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_PROVIDER_USECASES } from "@di/types-usecases";
import { ICompleteProviderProfileUseCase } from "@di/file-imports-index";

@injectable()
export class CompleteProviderProfileController {
  constructor(
    @inject(TYPES_PROVIDER_USECASES.CompleteProviderProfileUseCase)
    private _completeProviderProfileUseCase: ICompleteProviderProfileUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const providerId = (req as any).user._id;
    
    await this._completeProviderProfileUseCase.execute(providerId, req.body);

    sendResponse(
      res,
      "Profile updated successfully!",
      null,
      StatusCodes.OK
    );
  }
}
