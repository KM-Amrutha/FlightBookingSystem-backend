import { CreateFoodDTO, FoodResponseDTO } from "@application/dtos/food-dtos";

export interface ICreateFoodUseCase {
  execute(providerId: string, data: CreateFoodDTO): Promise<FoodResponseDTO>;
}