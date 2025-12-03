import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_ARICRAFT_USECASES } from "@di/types-usecases";
import { IDeleteAircraftUseCase } from "@di/file-imports-index";

@injectable()
export class DeleteAircraftController {
  constructor(
    @inject(TYPES_ARICRAFT_USECASES.DeleteAircraftUseCase)
    private _deleteAircraftUseCase: IDeleteAircraftUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const providerId = (req as any).user._id;
      const aircraftId = req.params.aircraftId;

      if (!aircraftId) {
        sendResponse(
          res,
          "Aircraft ID is required",
          null,
          StatusCodes.BadRequest
        );
        return;
      }

      await this._deleteAircraftUseCase.execute(providerId, aircraftId);

      sendResponse(
        res,
        "Aircraft deleted successfully",
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
