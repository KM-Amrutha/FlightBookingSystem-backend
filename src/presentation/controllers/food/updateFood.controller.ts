import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_FOOD_USECASES } from "@di/types-usecases";
import { IUpdateFoodUseCase } from "@di/file-imports-index";
import { UpdateFoodDTO } from "@application/dtos/food-dtos";
import { FOOD_MESSAGES } from "@shared/constants/foodMessages/food.messages";

@injectable()
export class UpdateFoodController {
  constructor(
    @inject(TYPES_FOOD_USECASES.UpdateFoodUseCase)
    private _updateFoodUseCase: IUpdateFoodUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const providerId = req.user!.id;
    const { foodId } = req.params;
    const {
      foodName, foodType, vegNonveg,
      serveMethod, isComplimentary,
      foodPrice, image, isActive,
    } = req.body;
    
    if(!foodId){
        throw new Error()
    }

    const data: UpdateFoodDTO = {
      ...(foodName && { foodName }),
      ...(foodType && { foodType }),
      ...(vegNonveg && { vegNonveg }),
      ...(serveMethod && { serveMethod }),
      ...(isComplimentary !== undefined && { isComplimentary: Boolean(isComplimentary) }),
      ...(foodPrice !== undefined && { foodPrice: Number(foodPrice) }),
      ...(image !== undefined && { image }),
      ...(isActive !== undefined && { isActive: Boolean(isActive) }),
    };

    const result = await this._updateFoodUseCase.execute(providerId, foodId, data);

    sendResponse(res, FOOD_MESSAGES.FOOD_UPDATED, result, StatusCodes.OK);
  }
}