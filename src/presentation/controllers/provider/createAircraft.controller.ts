import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_ARICRAFT_USECASES } from "@di/types-usecases";
import { ICreateAircraftUseCase } from "@di/file-imports-index";
import { CreateAircraftDTO } from "@application/dtos/aircraft-dtos";

@injectable()
export class CreateAircraftController {
  constructor(
    @inject(TYPES_ARICRAFT_USECASES.CreateAircraftUseCase)
    private _createAircraftUseCase: ICreateAircraftUseCase
  ) {}

  
  async handle(req: Request, res: Response): Promise<void> {
    console.log('ivide ethiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii')
    console.log("CreateAircraftController.handle called with body:", req.body);
    try {
      const providerId = (req as any).user._id;

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
      console.log('aircraft data is:',aircraftData)

      const aircraft = await this._createAircraftUseCase.execute(aircraftData);

      sendResponse(
        res,
        "Aircraft created successfully",
        aircraft,
        StatusCodes.Created
      );
    } catch (error: any) {
    console.error('Error message:', error.message);       
    console.error('Error stack:', error.stack);          
    
      sendResponse(
        res,
        error.message,
        null,
        StatusCodes.BadRequest
      );
    }
  }
}
