import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_FOOD_USECASES } from "@di/types-usecases";
import { IGetFoodsByAircraftUseCase } from "@di/file-imports-index";
import { FOOD_MESSAGES } from "@shared/constants/foodMessages/food.messages";
import { parseQueryParams } from "@shared/utils/parse-queryParams";

@injectable()
export class GetFoodsByAircraftController {
  constructor(
    @inject(TYPES_FOOD_USECASES.GetFoodsByAircraftUseCase)
    private _getFoodsByAircraftUseCase: IGetFoodsByAircraftUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { aircraftId } = req.params;
    const { page, limit } = parseQueryParams(req.query);
if(!aircraftId){
    throw new Error()
}
    const result = await this._getFoodsByAircraftUseCase.execute(
      userId,
      aircraftId,
      page,
      limit
    );

    sendResponse(res, FOOD_MESSAGES.FOOD_RETRIEVED, result, StatusCodes.OK);
  }
}