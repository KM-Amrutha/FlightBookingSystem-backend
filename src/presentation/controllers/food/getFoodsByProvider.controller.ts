import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_FOOD_USECASES } from "@di/types-usecases";
import { IGetFoodsByProviderUseCase } from "@di/file-imports-index";
import { FOOD_MESSAGES } from "@shared/constants/foodMessages/food.messages";
import { parseQueryParams } from "@shared/utils/parse-queryParams";

@injectable()
export class GetFoodsByProviderController {
  constructor(
    @inject(TYPES_FOOD_USECASES.GetFoodsByProviderUseCase)
    private _getFoodsByProviderUseCase: IGetFoodsByProviderUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const providerId = req.user!.id;
    const { page, limit } = parseQueryParams(req.query);

    const result = await this._getFoodsByProviderUseCase.execute(
      providerId,
      page,
      limit
    );

    sendResponse(res, FOOD_MESSAGES.FOOD_RETRIEVED, result, StatusCodes.OK);
  }
}