import { inject, injectable } from "inversify";
import { IFoodRepository } from "@domain/interfaces/IFoodRepository";
import { IAircraftRepository } from "@domain/interfaces/IAircraftRepository";
import { IGetFoodsByAircraftUseCase } from "@di/file-imports-index";
import { PaginatedFoodResponseDTO } from "@application/dtos/food-dtos";
import { NotFoundError, validationError } from "@presentation/middlewares/error.middleware";
import { TYPES_AIRCRAFT_REPOSITORIES, TYPES_BOOKING_REPOSITORIES } from "@di/types-repositories";
import { FoodMapper } from "@application/mappers/foodMapper";
import { FOOD_MESSAGES } from "@shared/constants/foodMessages/food.messages";

@injectable()
export class GetFoodsByAircraftUseCase implements IGetFoodsByAircraftUseCase {
  constructor(
    @inject(TYPES_BOOKING_REPOSITORIES.FoodRepository)
    private _foodRepository: IFoodRepository,
    @inject(TYPES_AIRCRAFT_REPOSITORIES.AircraftRepository)
    private _aircraftRepository: IAircraftRepository
  ) {}

  async execute(
    userId: string,
    aircraftId: string,
    page: number,
    limit: number
  ): Promise<PaginatedFoodResponseDTO> {
    if (!aircraftId) {
      throw new validationError(FOOD_MESSAGES.FOOD_AIRCRAFT_NOT_FOUND);
    }

    const aircraft = await this._aircraftRepository.getAircraftById(aircraftId);
    if (!aircraft) {
      throw new NotFoundError(FOOD_MESSAGES.FOOD_AIRCRAFT_NOT_FOUND);
    }

    const result = await this._foodRepository.getActiveFoodsByAircraftId(
      aircraftId,
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