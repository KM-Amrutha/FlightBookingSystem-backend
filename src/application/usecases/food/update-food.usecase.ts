import { inject, injectable } from "inversify";
import { IFoodRepository } from "@domain/interfaces/IFoodRepository";
import { ICloudStorageService } from "@application/interfaces/service/storage/ICloud.storage.service";
import { IUpdateFoodUseCase } from "@di/file-imports-index";
import { UpdateFoodDTO, FoodResponseDTO } from "@application/dtos/food-dtos";
import { NotFoundError, validationError, ForbiddenError } from "@presentation/middlewares/error.middleware";
import { TYPES_BOOKING_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";
import { FoodMapper } from "@application/mappers/foodMapper";
import { FOOD_MESSAGES } from "@shared/constants/foodMessages/food.messages";

@injectable()
export class UpdateFoodUseCase implements IUpdateFoodUseCase {
  constructor(
    @inject(TYPES_BOOKING_REPOSITORIES.FoodRepository)
    private _foodRepository: IFoodRepository,
    @inject(TYPES_SERVICES.S3StorageService)
    private _cloudStorageService: ICloudStorageService
  ) {}

  async execute(
    providerId: string,
    foodId: string,
    data: UpdateFoodDTO
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

    const isComplimentary =
      data.isComplimentary !== undefined
        ? data.isComplimentary
        : food.isComplimentary;

    const foodPrice =
      data.foodPrice !== undefined ? data.foodPrice : food.foodPrice;

    if (!isComplimentary && foodPrice <= 0) {
      throw new validationError(FOOD_MESSAGES.FOOD_INVALID_PRICE);
    }

    // ── upload new image if provided ──────────────────────────────────────
    let imageUrl: string | null = food.image;
    if (data.image) {
      imageUrl = await this._cloudStorageService.uploadImage({
        image: data.image,
        folder: "foods",
      });
    }

    const updated = await this._foodRepository.updateFood(foodId, {
      ...(data.foodName && { foodName: data.foodName.trim() }),
      ...(data.foodType && { foodType: data.foodType.trim() }),
      ...(data.vegNonveg && { vegNonveg: data.vegNonveg }),
      ...(data.serveMethod && { serveMethod: data.serveMethod.trim() }),
      ...(data.isComplimentary !== undefined && {
        isComplimentary: data.isComplimentary,
      }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      image: imageUrl,
      foodPrice: isComplimentary ? 0 : foodPrice,
    });

    if (!updated) throw new NotFoundError(FOOD_MESSAGES.FOOD_NOT_FOUND);

    return FoodMapper.toFoodResponseDTO(updated);
  }
}