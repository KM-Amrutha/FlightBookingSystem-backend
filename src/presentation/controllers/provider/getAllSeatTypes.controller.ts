import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_ARICRAFT_USECASES } from "@di/types-usecases";
import { IGetAllSeatTypesUseCase } from "@di/file-imports-index";

@injectable()
export class GetAllSeatTypesController {
  constructor(
    @inject(TYPES_ARICRAFT_USECASES.GetAllSeatTypesUseCase)
    private _getAllSeatTypesUseCase: IGetAllSeatTypesUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const seatTypes = await this._getAllSeatTypesUseCase.execute();

      sendResponse(
        res,
        "Seat types retrieved successfully",
        seatTypes,
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
