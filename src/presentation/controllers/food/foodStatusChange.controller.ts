import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_FOOD_USECASES } from "@di/types-usecases";
import { IFoodStatusChangeUseCase } from "@di/file-imports-index";
import { FOOD_MESSAGES } from "@shared/constants/foodMessages/food.messages";

@injectable()
export class FoodStatusChangeController {
  constructor(
    @inject(TYPES_FOOD_USECASES.FoodStatusChangeUseCase)
    private _toggleFoodStatusUseCase: IFoodStatusChangeUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const providerId = req.user!.id;
    const { foodId } = req.params;

    if(!foodId){
        throw new Error(FOOD_MESSAGES.FOOD_ID_REQUIRED);
    }
    const result = await this._toggleFoodStatusUseCase.execute(
      providerId,
      foodId,
    );

    sendResponse(res, FOOD_MESSAGES.FOOD_UPDATED, result, StatusCodes.OK);
  }
}