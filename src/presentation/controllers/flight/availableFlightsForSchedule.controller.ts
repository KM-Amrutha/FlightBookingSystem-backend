import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_AIRCRAFT_USECASES } from "@di/types-usecases";
import { IAvailableAircraftsForScheduleUsecase } from "@di/file-imports-index";

@injectable()
export class AvailableAircraftsForScheduleController {
  constructor(
    @inject(TYPES_AIRCRAFT_USECASES.AvailableAircraftsForScheduleUseCase)
    private _useCase: IAvailableAircraftsForScheduleUsecase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const providerId = (req as any).user._id;
      const { departureDestinationId, departureTime } = req.query;

      if (!departureDestinationId || !departureTime) {
        sendResponse(
          res,
          "departureDestinationId and departureTime are required",
          null,
          StatusCodes.BadRequest
        );
        return;
      }

      const aircrafts = await this._useCase.execute(
        providerId,
        String(departureDestinationId),
        String(departureTime)
      );

      sendResponse(
        res,
        "Available aircrafts retrieved successfully",
        aircrafts,
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
