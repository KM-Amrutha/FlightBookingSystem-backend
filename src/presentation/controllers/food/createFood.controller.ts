import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_FOOD_USECASES } from "@di/types-usecases";
import { ICreateFoodUseCase } from "@di/file-imports-index";
import { CreateFoodDTO } from "@application/dtos/food-dtos";
import { FOOD_MESSAGES } from "@shared/constants/foodMessages/food.messages";

@injectable()
export class CreateFoodController {
  constructor(
    @inject(TYPES_FOOD_USECASES.CreateFoodUseCase)
    private _createFoodUseCase: ICreateFoodUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const providerId = req.user!.id;
    const {
      aircraftId, foodName, foodType,
      vegNonveg, serveMethod, isComplimentary,
      foodPrice, image,
    } = req.body;

    const data: CreateFoodDTO = {
      aircraftId,
      foodName,
      foodType,
      vegNonveg,
      serveMethod,
      isComplimentary: Boolean(isComplimentary),
      foodPrice: Number(foodPrice),
      ...(image && { image }),
    };

    const result = await this._createFoodUseCase.execute(providerId, data);

    sendResponse(res, FOOD_MESSAGES.FOOD_CREATED, result, StatusCodes.CREATED);
  }
}