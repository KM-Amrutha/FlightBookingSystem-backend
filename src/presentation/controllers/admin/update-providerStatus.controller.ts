import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/http.status.codes";

import { UpdateProviderStatusUseCase } from "@di/file-imports-index";
import { TYPES_ADMIN_USECASES } from "@di/types-usecases";

@injectable()
export class UpdateProviderStatusController {
  constructor(
    @inject(TYPES_ADMIN_USECASES.UpdateProviderStatusUseCase)
    private _updateProviderStatusUseCase: UpdateProviderStatusUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { id: providerId } = req.params;
      const { isActive } = req.body;

      if (!providerId) {
        sendResponse(res, "Provider ID is required", null, StatusCodes.BAD_REQUEST);
        return;
      }

      if (typeof isActive !== "boolean") {
        sendResponse(res, "isActive must be true or false", null, StatusCodes.BAD_REQUEST);
        return;
      }

      await this._updateProviderStatusUseCase.execute(providerId, isActive);

      sendResponse(
        res,
        `Provider has been ${isActive ? "activated" : "blocked"} successfully`,
        null,
        StatusCodes.OK
      );
    } catch (error: any) {
      sendResponse(
        res,
        error.message || "Failed to update provider status",
        null,
        StatusCodes.BAD_REQUEST
      );
    }
  }
}