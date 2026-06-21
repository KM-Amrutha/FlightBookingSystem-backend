import { inject, injectable } from "inversify";
import { IFoodRepository } from "@domain/interfaces/IFoodRepository";
import { IDeleteFoodUseCase } from "@di/file-imports-index";
import { FoodResponseDTO } from "@application/dtos/food-dtos";
import { NotFoundError, validationError, ForbiddenError } from "@presentation/middlewares/error.middleware";
import { TYPES_BOOKING_REPOSITORIES } from "@di/types-repositories";
import { FoodMapper } from "@application/mappers/foodMapper";
import { FOOD_MESSAGES } from "@shared/constants/foodMessages/food.messages";

@injectable()
export class DeleteFoodUseCase implements IDeleteFoodUseCase {
  constructor(
    @inject(TYPES_BOOKING_REPOSITORIES.FoodRepository)
    private _foodRepository: IFoodRepository
  ) {}

  async execute(
    providerId: string,
    foodId: string
  ): Promise<FoodResponseDTO> {
    if (!foodId) {
      throw new validationError(FOOD_MESSAGES.FOOD_ID_REQUIRED);
    }

    const food = await this._foodRepository.getFoodById(foodId);
    if (!food) {
      throw new NotFoundError(FOOD_MESSAGES.FOOD_NOT_FOUND);
    }
  
    if (food.providerId.toString() !== providerId.toString()) {
      throw new ForbiddenError(FOOD_MESSAGES.FOOD_NOT_YOUR_FOOD);
    }

    const deleted = await this._foodRepository.deleteFoodById(foodId);
    if (!deleted) throw new NotFoundError(FOOD_MESSAGES.FOOD_NOT_FOUND);

    return FoodMapper.toFoodResponseDTO(deleted);
  }
}