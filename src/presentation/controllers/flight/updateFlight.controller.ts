import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_FLIGHT_USECASES } from "@di/types-usecases";
import { IUpdateFlightUseCase } from "@di/file-imports-index";
import { UpdateFlightDTO } from "@application/dtos/flight-dtos";
import { FLIGHT_MESSAGES } from "@shared/constants/flightMessages/flight.messges";

@injectable()
export class UpdateFlightController {
  constructor(
    @inject(TYPES_FLIGHT_USECASES.UpdateFlightUseCase)
    private _updateFlightUseCase: IUpdateFlightUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const providerId = req.user!._id;
      const flightId = req.params.flightId;

      if (!flightId) {
        sendResponse(
          res,
          FLIGHT_MESSAGES.ID_REQUIRED,
          null,
          StatusCodes.BAD_REQUEST
        );
        return;
      }

      const body = req.body;

      // -------- Build baseFare (only if provided) --------
      const baseFare: UpdateFlightDTO["baseFare"] = {};

      if (body.baseFare?.economy != null) {
        baseFare.economy = Number(body.baseFare.economy);
      }
      if (body.baseFare?.premium_economy != null) {
        baseFare.premium_economy = Number(body.baseFare.premium_economy);
      }
      if (body.baseFare?.business != null) {
        baseFare.business = Number(body.baseFare.business);
      }
      if (body.baseFare?.first != null) {
        baseFare.first = Number(body.baseFare.first);
      }

      // -------- Build seatSurcharge (only if provided) --------
      const seatSurcharge: UpdateFlightDTO["seatSurcharge"] = {};

      if (body.seatSurcharge?.window != null) {
        seatSurcharge.window = Number(body.seatSurcharge.window);
      }
      if (body.seatSurcharge?.aisle != null) {
        seatSurcharge.aisle = Number(body.seatSurcharge.aisle);
      }
      if (body.seatSurcharge?.extraLegroom != null) {
        seatSurcharge.extraLegroom = Number(body.seatSurcharge.extraLegroom);
      }

      // -------- Build baggageRules (only if provided) --------
      const baggageRules: UpdateFlightDTO["baggageRules"] = {};

      if (body.baggageRules?.freeCabinKg != null) {
        baggageRules.freeCabinKg = Number(body.baggageRules.freeCabinKg);
      }
      if (body.baggageRules?.extraChargePerKg != null) {
        baggageRules.extraChargePerKg = Number(body.baggageRules.extraChargePerKg);
      }
      if (body.baggageRules?.maxExtraKg != null) {
        baggageRules.maxExtraKg = Number(body.baggageRules.maxExtraKg);
      }

      // -------- Final UpdateFlightDTO construction (FIXED) --------
      const updateData = {} as UpdateFlightDTO;

      if (body.flightNumber !== undefined) {
        updateData.flightNumber = body.flightNumber;
      }
      if (body.gate !== undefined) {
        updateData.gate = body.gate;
      }
      if (body.durationMinutes != null) {
        updateData.durationMinutes = Number(body.durationMinutes);
      }
      if (body.arrivalDestinationId !== undefined) {
        updateData.arrivalDestinationId = body.arrivalDestinationId;
      }
      if (Object.keys(baseFare).length > 0) {
        updateData.baseFare = baseFare;
      }
      if (Object.keys(seatSurcharge).length > 0) {
        updateData.seatSurcharge = seatSurcharge;
      }
      if (Object.keys(baggageRules).length > 0) {
        updateData.baggageRules = baggageRules;
      }
      if (body.luggageRuleId !== undefined) {
        updateData.luggageRuleId = body.luggageRuleId === null ? null : body.luggageRuleId;
      }
      if (body.foodMenuId !== undefined) {
        updateData.foodMenuId = body.foodMenuId;
      }

      const updatedFlight = await this._updateFlightUseCase.execute(
        providerId,
        flightId,
        updateData
      );

      sendResponse(
        res,
        "Flight updated successfully and sent for admin approval",
        updatedFlight,
        StatusCodes.OK
      );
    } catch (error: any) {
      console.error("Flight update error:", error.message || error);
      sendResponse(
        res,
        error.message || "Failed to update flight",
        null,
        StatusCodes.BAD_REQUEST
      );
    }
  }
}