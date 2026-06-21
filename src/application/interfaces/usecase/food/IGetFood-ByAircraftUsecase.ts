import { PaginatedFoodResponseDTO } from "@application/dtos/food-dtos";

export interface IGetFoodsByAircraftUseCase {
  execute(userId: string, aircraftId: string, page: number, limit: number): Promise<PaginatedFoodResponseDTO>;
}