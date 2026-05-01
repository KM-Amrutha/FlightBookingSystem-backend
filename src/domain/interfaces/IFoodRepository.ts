import { IFood } from "@domain/entities/food.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";

export interface IFoodRepository extends IBaseRepository<IFood> {
  // Provider creates a food item for their aircraft
  createFood(data: Partial<IFood>): Promise<IFood>;

  // Get all food items for an aircraft (used at booking time)
  getFoodsByAircraftId(aircraftId: string): Promise<IFood[]>;

  // Get all food items for a provider (provider dashboard)
  getFoodsByProviderId(providerId: string, page: number, limit: number): Promise<{
    foods: IFood[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }>;

  // Get single food item
  getFoodById(foodId: string): Promise<IFood | null>;

  // Provider updates a food item
  updateFood(foodId: string, data: Partial<IFood>): Promise<IFood | null>;

  // Provider deletes a food item
  deleteFoodById(foodId: string): Promise<IFood | null>;

  // Get only active food items for an aircraft (used at booking time)
  getActiveFoodsByAircraftId(
  aircraftId: string,
  page: number,
  limit: number
): Promise<{
  foods: IFood[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}>;
}