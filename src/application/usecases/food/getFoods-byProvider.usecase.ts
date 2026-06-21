import { inject, injectable } from "inversify";
import { IFoodRepository } from "@domain/interfaces/IFoodRepository";
import { IGetFoodsByProviderUseCase } from "@di/file-imports-index";
import { PaginatedFoodResponseDTO } from "@application/dtos/food-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import { TYPES_BOOKING_REPOSITORIES } from "@di/types-repositories";
import { FoodMapper } from "@application/mappers/foodMapper";
import { FOOD_MESSAGES } from "@shared/constants/foodMessages/food.messages";

@injectable()
export class GetFoodsByProviderUseCase implements IGetFoodsByProviderUseCase {
  constructor(
    @inject(TYPES_BOOKING_REPOSITORIES.FoodRepository)
    private _foodRepository: IFoodRepository
  ) {}

  async execute(
    providerId: string,
    page: number,
    limit: number
  ): Promise<PaginatedFoodResponseDTO> {
    if (!providerId) {
      throw new validationError(FOOD_MESSAGES.FOOD_ID_REQUIRED);
    }

    const result = await this._foodRepository.getFoodsByProviderId(
      providerId,
      page,
      limit
    );
    return {
      foods: FoodMapper.toFoodResponseDTOs(result.foods),
      totalCount: result.totalCount,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
    };
  }
}