import { PaginatedFoodResponseDTO } from "@application/dtos/food-dtos";

export interface IGetFoodsByProviderUseCase {
  execute(providerId: string, page: number, limit: number): Promise<PaginatedFoodResponseDTO>;
}