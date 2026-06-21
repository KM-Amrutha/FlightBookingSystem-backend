import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_FLIGHT_USECASES } from "@di/types-usecases";
import { IAvailableAircraftsForScheduleUsecase } from "@di/file-imports-index";

@injectable()
export class AvailableAircraftsForScheduleController {
  constructor(
    @inject(TYPES_FLIGHT_USECASES.AvailableAircraftsForScheduleUseCase)
    private _availableAircraftsForScheduleUsecase: IAvailableAircraftsForScheduleUsecase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const providerId = req.user!.id;
      const { departureDestinationId, departureTime, durationMinutes,bufferMinutes } = req.query;

     if (!departureDestinationId || !departureTime || !durationMinutes || !bufferMinutes) {
         sendResponse(res, "departureDestinationId, departureTime, durationMinutes and bufferMinutes are required", 
            null,
         StatusCodes.BAD_REQUEST);
       return;
       }
      const aircrafts = await this._availableAircraftsForScheduleUsecase.execute(
        providerId,
        String(departureDestinationId),
        String(departureTime),
        Number(durationMinutes),
        Number(bufferMinutes)
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
        StatusCodes.BAD_REQUEST
      );
    }
  }
}