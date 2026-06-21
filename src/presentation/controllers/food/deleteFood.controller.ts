import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_FOOD_USECASES } from "@di/types-usecases";
import { IDeleteFoodUseCase } from "@di/file-imports-index";
import { FOOD_MESSAGES } from "@shared/constants/foodMessages/food.messages";

@injectable()
export class DeleteFoodController {
  constructor(
    @inject(TYPES_FOOD_USECASES.DeleteFoodUseCase)
    private _deleteFoodUseCase: IDeleteFoodUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const providerId = req.user!.id;
    const { foodId } = req.params;
    if(!foodId){
        throw new Error()
    }

    const result = await this._deleteFoodUseCase.execute(providerId, foodId);

    sendResponse(res, FOOD_MESSAGES.FOOD_DELETED, result, StatusCodes.OK);
  }
}