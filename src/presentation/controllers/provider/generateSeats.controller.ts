import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_ARICRAFT_USECASES } from "@di/types-usecases";
import { IGenerateSeatsUseCase } from "@di/file-imports-index";

@injectable()
export class GenerateSeatsController {
  constructor(
    @inject(TYPES_ARICRAFT_USECASES.GenerateSeatsUseCase)
    private _generateSeatsUseCase: IGenerateSeatsUseCase
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

      const seats = await this._generateSeatsUseCase.execute(
        providerId,
        aircraftId
      );

      sendResponse(
        res,
        `Successfully generated ${seats.length} seats`,
        {
          totalSeats: seats.length,
          seats: seats
        },
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
