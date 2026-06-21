import { IFood } from "@domain/entities/food.entity";
import { FoodResponseDTO } from "@application/dtos/food-dtos";

export class FoodMapper {

  static toFoodResponseDTO(food: IFood): FoodResponseDTO {
    return {
      id: food.id,
      aircraftId: food.aircraftId,
      ...(food.aircraftName && {
       aircraftName: food.aircraftName,
       }),
      providerId: food.providerId,
      foodName: food.foodName,
      foodType: food.foodType,
      vegNonveg: food.vegNonveg,
      serveMethod: food.serveMethod,
      isComplimentary: food.isComplimentary,
      foodPrice: food.isComplimentary ? 0 : food.foodPrice,
      image: food.image,
      isActive: food.isActive,
      createdAt: food.createdAt.toISOString(),
      updatedAt: food.updatedAt.toISOString(),
    };
  }

  static toFoodResponseDTOs(foods: IFood[]): FoodResponseDTO[] {
    return foods.map((food) => this.toFoodResponseDTO(food));
  }
}