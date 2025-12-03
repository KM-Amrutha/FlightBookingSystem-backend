import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_ARICRAFT_USECASES } from "@di/types-usecases";
import { ICreateSeatLayoutUseCase } from "@di/file-imports-index";
import { CreateSeatLayoutDTO } from "@application/dtos/seat-dtos";

@injectable()
export class CreateSeatLayoutController {
  constructor(
    @inject(TYPES_ARICRAFT_USECASES.CreateSeatLayoutUseCase)
    private _createSeatLayoutUseCase: ICreateSeatLayoutUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const providerId = (req as any).user._id;

      const layoutData: CreateSeatLayoutDTO = {
        aircraftId: req.body.aircraftId,
        cabinClass: req.body.cabinClass,
        layout: req.body.layout,
        startRow: Number(req.body.startRow),
        endRow: Number(req.body.endRow),
        seatsPerRow: Number(req.body.seatsPerRow),
        columns: req.body.columns || [],
        aisleColumns: req.body.aisleColumns || [],
        exitRows: req.body.exitRows || [],
        wingStartRow: req.body.wingStartRow ? Number(req.body.wingStartRow) : 0,
        wingEndRow: req.body.wingEndRow ? Number(req.body.wingEndRow) : 0
      };

      const seatLayout = await this._createSeatLayoutUseCase.execute(
        providerId,
        layoutData
      );

      sendResponse(
        res,
        "Seat layout created successfully",
        seatLayout,
        StatusCodes.Created
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
