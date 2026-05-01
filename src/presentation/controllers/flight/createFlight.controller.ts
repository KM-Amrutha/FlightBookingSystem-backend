import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_FLIGHT_USECASES } from "@di/types-usecases";
import { ICreateFlightUseCase } from "@di/file-imports-index";
import { CreateFlightDTO } from "@application/dtos/flight-dtos";
import { FLIGHT_MESSAGES } from "@shared/constants/flightMessages/flight.messges";

@injectable()
export class CreateFlightController {
  constructor(
    @inject(TYPES_FLIGHT_USECASES.CreateFlightUseCase)
    private _createFlightUseCase: ICreateFlightUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const providerId = req.user!._id;
      const body = req.body;

      const baseFare: CreateFlightDTO["baseFare"] = {
        economy: Number(body.baseFare?.economy),
      };
      if (body.baseFare?.premium_economy != null) baseFare.premium_economy = Number(body.baseFare.premium_economy);
      if (body.baseFare?.business != null) baseFare.business = Number(body.baseFare.business);
      if (body.baseFare?.first != null) baseFare.first = Number(body.baseFare.first);

      const seatSurcharge: CreateFlightDTO["seatSurcharge"] = {};
      if (body.seatSurcharge?.window != null) seatSurcharge.window = Number(body.seatSurcharge.window);
      if (body.seatSurcharge?.aisle != null) seatSurcharge.aisle = Number(body.seatSurcharge.aisle);
      if (body.seatSurcharge?.extraLegroom != null) seatSurcharge.extraLegroom = Number(body.seatSurcharge.extraLegroom);

      const baggageRules: CreateFlightDTO["baggageRules"] = {
        extraChargePerKg: Number(body.baggageRules?.extraChargePerKg),
        freeCabinKg: body.baggageRules?.freeCabinKg != null
          ? Number(body.baggageRules.freeCabinKg)
          : 7,
      };
      if (body.baggageRules?.maxExtraKg != null) baggageRules.maxExtraKg = Number(body.baggageRules.maxExtraKg);

      const flightData: CreateFlightDTO = {
        flightId: body.flightId,
        flightNumber: body.flightNumber,
        providerId,
        aircraftId: body.aircraftId,
        ...(body.seatLayoutId && { seatLayoutId: body.seatLayoutId }),
        departureDestinationId: body.departureDestinationId,
        arrivalDestinationId: body.arrivalDestinationId,
        departureTime: body.departureTime,
        durationMinutes: Number(body.durationMinutes),
        bufferMinutes: Number(body.bufferMinutes),
        ...(body.gate && { gate: body.gate }),
        baseFare,
        seatSurcharge,
        baggageRules,
        ...(body.luggageRuleId && { luggageRuleId: body.luggageRuleId }),
        ...(body.foodMenuId && { foodMenuId: body.foodMenuId }),
      };

      const flight = await this._createFlightUseCase.execute(providerId, flightData);

      sendResponse(
        res,
        FLIGHT_MESSAGES.CREATED,
        flight,
        StatusCodes.CREATED
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