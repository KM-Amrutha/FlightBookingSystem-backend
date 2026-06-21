import { FoodResponseDTO } from "@application/dtos/food-dtos";

export interface IFoodStatusChangeUseCase {
  execute(providerId: string, foodId: string): Promise<FoodResponseDTO>;
}