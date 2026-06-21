import { FoodResponseDTO } from "@application/dtos/food-dtos";

export interface IDeleteFoodUseCase {
  execute(providerId: string, foodId: string): Promise<FoodResponseDTO>;
}