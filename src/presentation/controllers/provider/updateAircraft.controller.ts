import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_ARICRAFT_USECASES } from "@di/types-usecases";
import { IUpdateAircraftUseCase } from "@di/file-imports-index";
import { UpdateAircraftDTO } from "@application/dtos/aircraft-dtos";

@injectable()
export class UpdateAircraftController {
  constructor(
    @inject(TYPES_ARICRAFT_USECASES.UpdateAircraftUseCase)
    private _updateAircraftUseCase: IUpdateAircraftUseCase
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
      const updateData: UpdateAircraftDTO = {};

      if (req.body.aircraftName !== undefined) {
        updateData.aircraftName = req.body.aircraftName;
      }
      if (req.body.buildYear !== undefined) {
        updateData.buildYear = Number(req.body.buildYear);
      }
      if (req.body.seatCapacity !== undefined) {
        updateData.seatCapacity = Number(req.body.seatCapacity);
      }
      if (req.body.flyingRangeKm !== undefined) {
        updateData.flyingRangeKm = Number(req.body.flyingRangeKm);
      }
      if (req.body.engineCount !== undefined) {
        updateData.engineCount = Number(req.body.engineCount);
      }
      if (req.body.lavatoryCount !== undefined) {
        updateData.lavatoryCount = Number(req.body.lavatoryCount);
      }
      if (req.body.baseStationId !== undefined) {
        updateData.baseStationId = req.body.baseStationId;
      }
      if (req.body.currentLocationId !== undefined) {
        updateData.currentLocationId = req.body.currentLocationId;
      }
      if (req.body.availableFrom !== undefined) {
        updateData.availableFrom = new Date(req.body.availableFrom);
      }
      if (req.body.status !== undefined) {
        updateData.status = req.body.status;
      }

      const aircraft = await this._updateAircraftUseCase.execute(
        providerId,
        aircraftId,
        updateData
      );

      sendResponse(
        res,
        "Aircraft updated successfully",
        aircraft,
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
