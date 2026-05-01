import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_AIRCRAFT_USECASES } from "@di/types-usecases";
import { ICreateAircraftUseCase } from "@di/file-imports-index";
import { CreateAircraftDTO } from "@application/dtos/aircraft-dtos";

@injectable()
export class CreateAircraftController {
  constructor(
    @inject(TYPES_AIRCRAFT_USECASES.CreateAircraftUseCase)
    private _createAircraftUseCase: ICreateAircraftUseCase
  ) {}

  
  async handle(req: Request, res: Response): Promise<void> {
    try {
      const providerId = req.user!._id;

      const aircraftData: CreateAircraftDTO = {
        providerId: providerId,
        aircraftType: req.body.aircraftType,
        aircraftName: req.body.aircraftName,
        manufacturer: req.body.manufacturer,
        buildYear: Number(req.body.buildYear),
        seatCapacity: Number(req.body.seatCapacity),
        flyingRangeKm: Number(req.body.flyingRangeKm),
        engineCount: Number(req.body.engineCount),
        lavatoryCount: Number(req.body.lavatoryCount),
        baseStationId: req.body.baseStationId,
        currentLocationId: req.body.currentLocationId,
        availableFrom: new Date(),
        status: "active"
      };
      

      const aircraft = await this._createAircraftUseCase.execute(aircraftData);

      sendResponse(
        res,
        "Aircraft created successfully",
        aircraft,
        StatusCodes.CREATED
      );
    } catch (error: any) {
    console.error('Error message:', error.message);       
    console.error('Error stack:', error.stack);          
    
      sendResponse(
        res,
        error.message,
        null,
        StatusCodes.BAD_REQUEST
      );
    }
  }
}
