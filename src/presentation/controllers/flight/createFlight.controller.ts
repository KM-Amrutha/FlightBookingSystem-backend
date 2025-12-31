import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_AIRCRAFT_USECASES } from "@di/types-usecases";
import { ICreateFlightUseCase } from "@di/file-imports-index";
import { CreateFlightDTO } from "@application/dtos/flight-dtos";
import { FLIGHT_MESSAGES } from "@shared/constants/flightMessages/flight.messges";

@injectable()
export class CreateFlightController {
  constructor(
    @inject(TYPES_AIRCRAFT_USECASES.CreateFlightUseCase)
    private _createFlightUseCase: ICreateFlightUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const providerId = (req as any).user._id;
      const body = req.body;

      // -------- build baseFare exactly matching CreateFlightDTO --------
      const baseFare: CreateFlightDTO["baseFare"] = {
        economy: Number(body.baseFare?.economy),
      };

      if (body.baseFare?.premiumEconomy != null) {
        baseFare.premiumEconomy = Number(body.baseFare.premiumEconomy);
      }
      if (body.baseFare?.business != null) {
        baseFare.business = Number(body.baseFare.business);
      }
      if (body.baseFare?.first != null) {
        baseFare.first = Number(body.baseFare.first);
      }

      // -------- build seatSurcharge --------
      const seatSurcharge: CreateFlightDTO["seatSurcharge"] = {};

      if (body.seatSurcharge?.window != null) {
        seatSurcharge.window = Number(body.seatSurcharge.window);
      }
      if (body.seatSurcharge?.aisle != null) {
        seatSurcharge.aisle = Number(body.seatSurcharge.aisle);
      }
      if (body.seatSurcharge?.extraLegroom != null) {
        seatSurcharge.extraLegroom = Number(body.seatSurcharge.extraLegroom);
      }

      // -------- build baggageRules (keep your default 7 kg) --------
      const baggageRules: CreateFlightDTO["baggageRules"] = {
        extraChargePerKg: Number(body.baggageRules?.extraChargePerKg),
      };

      if (body.baggageRules?.freeCabinKg != null) {
        baggageRules.freeCabinKg = Number(body.baggageRules.freeCabinKg);
      } else {
        baggageRules.freeCabinKg = 7;
      }

      if (body.baggageRules?.maxExtraKg != null) {
        baggageRules.maxExtraKg = Number(body.baggageRules.maxExtraKg);
      }

      // -------- your original DTO construction, unchanged except using the built objects --------
      const flightData: CreateFlightDTO = {
        flightId: body.flightId,                // you can generate UUID on FE or BE
        flightNumber: body.flightNumber,
        providerId,
        aircraftId: body.aircraftId,
        departureDestinationId: body.departureDestinationId,
        arrivalDestinationId: body.arrivalDestinationId,
        departureTime: body.departureTime,      // ISO string from FE (local dep time)
        durationMinutes: Number(body.durationMinutes),
        gate: body.gate,
        baseFare,
        seatSurcharge,
        baggageRules
      };

      const flight = await this._createFlightUseCase.execute(providerId, flightData);

      sendResponse(
        res,
        FLIGHT_MESSAGES.CREATED,
        flight,
        StatusCodes.CREATED
      );
    } catch (error: any) {
      console.error("Flight creation error:", error.message || error);
      sendResponse(
        res,
        error.message,
        null,
        StatusCodes.BAD_REQUEST
      );
    }
  }
}
