import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_ARICRAFT_USECASES } from "@di/types-usecases";
import { IDeleteSeatLayoutUseCase } from "@di/file-imports-index";

@injectable()
export class DeleteSeatLayoutController {
  constructor(
    @inject(TYPES_ARICRAFT_USECASES.DeleteSeatLayoutUseCase)
    private _deleteSeatLayoutUseCase: IDeleteSeatLayoutUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const layoutId = req.params.layoutId as string;

      if (!layoutId) {
        sendResponse(
          res,
          "Layout ID is required",
          null,
          StatusCodes.BadRequest
        );
        return;
      }

      await this._deleteSeatLayoutUseCase.execute(layoutId);

      sendResponse(
        res,
        "Seat layout deleted successfully",
        { layoutId },
        StatusCodes.OK
      );
    } catch (error: any) {
      sendResponse(
        res,
        error.message || "Failed to delete seat layout",
        null,
        StatusCodes.BadRequest
      );
    }
  }
}