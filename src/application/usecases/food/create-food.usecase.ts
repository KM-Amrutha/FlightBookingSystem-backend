import { inject, injectable } from "inversify";
import {IFoodRepository, IAircraftRepository } from "@di/file-imports-index";
import { ICloudStorageService } from "@di/file-imports-index";
import { ICreateFoodUseCase } from "@di/file-imports-index";
import { CreateFoodDTO, FoodResponseDTO } from "@application/dtos/food-dtos";
import { NotFoundError, validationError, ForbiddenError } from "@presentation/middlewares/error.middleware";
import { TYPES_AIRCRAFT_REPOSITORIES, TYPES_BOOKING_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";
import { FoodMapper } from "@application/mappers/foodMapper";
import { FOOD_MESSAGES } from "@shared/constants/foodMessages/food.messages";

@injectable()
export class CreateFoodUseCase implements ICreateFoodUseCase {
  constructor(
    @inject(TYPES_BOOKING_REPOSITORIES.FoodRepository)
    private _foodRepository: IFoodRepository,
    @inject(TYPES_AIRCRAFT_REPOSITORIES.AircraftRepository)
    private _aircraftRepository: IAircraftRepository,
    @inject(TYPES_SERVICES.S3StorageService)
    private _cloudStorageService: ICloudStorageService
  ) {}

  async execute(
    providerId: string,
    data: CreateFoodDTO
  ): Promise<FoodResponseDTO> {
    if (
      !data.aircraftId ||
      !data.foodName ||
      !data.foodType ||
      !data.vegNonveg ||
      !data.serveMethod ||
      data.isComplimentary === undefined
    ) {
      throw new validationError(FOOD_MESSAGES.FOOD_ALL_FIELDS_REQUIRED);
    }

    if (!data.isComplimentary && (!data.foodPrice || data.foodPrice <= 0)) {
      throw new validationError(FOOD_MESSAGES.FOOD_INVALID_PRICE);
    }

    const aircraft = await this._aircraftRepository.getAircraftById(
      data.aircraftId
    );
    if (!aircraft) {
      throw new NotFoundError(FOOD_MESSAGES.FOOD_AIRCRAFT_NOT_FOUND);
    }
    if (aircraft.providerId !== providerId) {
      throw new ForbiddenError(FOOD_MESSAGES.FOOD_NOT_YOUR_AIRCRAFT);
    }

    // ── upload image if provided ──────────────────────────────────────────
    let imageUrl: string | null = null;
    if (data.image) {
      imageUrl = await this._cloudStorageService.uploadImage({
        image: data.image,
        folder: "foods",
      });
    }

    const food = await this._foodRepository.createFood({
      aircraftId: data.aircraftId,
      providerId,
      foodName: data.foodName.trim(),
      foodType: data.foodType.trim(),
      vegNonveg: data.vegNonveg,
      serveMethod: data.serveMethod.trim(),
      isComplimentary: data.isComplimentary,
      foodPrice: data.isComplimentary ? 0 : data.foodPrice,
      image: imageUrl,
      isActive: true,
    });

    return FoodMapper.toFoodResponseDTO(food);
  }
}