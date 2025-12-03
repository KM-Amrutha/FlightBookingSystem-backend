import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_ARICRAFT_USECASES } from "@di/types-usecases";
import { IGetSeatLayoutsByAircraftUseCase } from "@di/file-imports-index";

@injectable()
export class GetSeatLayoutsController {
  constructor(
    @inject(TYPES_ARICRAFT_USECASES.GetSeatLayoutsByAircraftUseCase)
    private _getSeatLayoutsUseCase: IGetSeatLayoutsByAircraftUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
  try {
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
    
    const seatLayouts = await this._getSeatLayoutsUseCase.execute(aircraftId);

    sendResponse(
      res,
      "Seat layouts retrieved successfully",
      seatLayouts,
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
