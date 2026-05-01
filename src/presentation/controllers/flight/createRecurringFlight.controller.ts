import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_FLIGHT_USECASES } from "@di/types-usecases";
import { ICreateRecurringFlightUseCase } from "@di/file-imports-index";
import { CreateRecurringFlightDTO } from "@application/dtos/flight-dtos";
import { FLIGHT_MESSAGES } from "@shared/constants/flightMessages/flight.messges";

@injectable()
export class CreateRecurringFlightController {
  constructor(
    @inject(TYPES_FLIGHT_USECASES.CreateRecurringFlightUseCase)
    private _createRecurringFlightUseCase: ICreateRecurringFlightUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const providerId = req.user!._id;
      const body = req.body;

      const baseFare: CreateRecurringFlightDTO["baseFare"] = {
        economy: Number(body.baseFare?.economy),
      };
      if (body.baseFare?.premium_economy != null) baseFare.premium_economy = Number(body.baseFare.premium_economy);
      if (body.baseFare?.business != null) baseFare.business = Number(body.baseFare.business);
      if (body.baseFare?.first != null) baseFare.first = Number(body.baseFare.first);

      const seatSurcharge: CreateRecurringFlightDTO["seatSurcharge"] = {};
      if (body.seatSurcharge?.window != null) seatSurcharge.window = Number(body.seatSurcharge.window);
      if (body.seatSurcharge?.aisle != null) seatSurcharge.aisle = Number(body.seatSurcharge.aisle);
      if (body.seatSurcharge?.extraLegroom != null) seatSurcharge.extraLegroom = Number(body.seatSurcharge.extraLegroom);

      const baggageRules: CreateRecurringFlightDTO["baggageRules"] = {
        extraChargePerKg: Number(body.baggageRules?.extraChargePerKg),
        freeCabinKg: body.baggageRules?.freeCabinKg != null
          ? Number(body.baggageRules.freeCabinKg)
          : 7,
      };
      if (body.baggageRules?.maxExtraKg != null) baggageRules.maxExtraKg = Number(body.baggageRules.maxExtraKg);

      const rawWeekdays = body.weekdays;
      const weekdays: number[] = Array.isArray(rawWeekdays)
        ? rawWeekdays.map(Number)
        : typeof rawWeekdays === "string"
          ? rawWeekdays.split(",").map((d: string) => Number(d.trim()))
          : [];

      const dto: CreateRecurringFlightDTO = {
        aircraftId: body.aircraftId,
        departureDestinationId: body.departureDestinationId,
        arrivalDestinationId: body.arrivalDestinationId,
        baseFlightId: body.baseFlightId,
        baseFlightNumber: body.baseFlightNumber,
        departureTimeOfDay: body.departureTimeOfDay,
        startDate: body.startDate,
        endDate: body.endDate,
        weekdays,
        durationMinutes: Number(body.durationMinutes),
        bufferMinutes: Number(body.bufferMinutes),
        ...(body.gate && { gate: body.gate }),
        baseFare,
        seatSurcharge,
        baggageRules,
        ...(body.luggageRuleId && { luggageRuleId: body.luggageRuleId }),
        ...(body.foodMenuId && { foodMenuId: body.foodMenuId }),
        ...(body.seatLayoutId && { seatLayoutId: body.seatLayoutId }),
      };

      const result = await this._createRecurringFlightUseCase.execute(providerId, dto);

      sendResponse(
        res,
        FLIGHT_MESSAGES.CREATED,
        result,
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