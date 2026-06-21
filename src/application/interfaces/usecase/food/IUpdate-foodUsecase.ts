import { UpdateFoodDTO, FoodResponseDTO } from "@application/dtos/food-dtos";

export interface IUpdateFoodUseCase {
  execute(providerId: string, foodId: string, data: UpdateFoodDTO): Promise<FoodResponseDTO>;
}