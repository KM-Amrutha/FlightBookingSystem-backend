import { IFood } from "@domain/entities/food.entity";
import FoodModel from "@infrastructure/databases/models/food.model";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { IFoodRepository } from "@domain/interfaces/IFoodRepository";
import { paginateReq, paginateRes } from "@shared/utils/pagination";

export class FoodRepository
  extends BaseRepository<IFood>
  implements IFoodRepository
{
  constructor() {
    super(FoodModel);
  }

  async createFood(data: Partial<IFood>): Promise<IFood> {
    const newFood = new FoodModel(data);
    const saved = await newFood.save();
    const food = await this.getFoodById(saved.id.toString());
    if (!food) throw new Error("Failed to retrieve created food item");
    return food;
  }

  async getFoodById(foodId: string): Promise<IFood | null> {
    const docs = await FoodModel.aggregate([
      { $match: { _id: this.parseId(foodId) } },
      {
        $project: {
          _id: 1,
          aircraftId: 1,
          providerId: 1,
          foodName: 1,
          foodType: 1,
          vegNonveg: 1,
          serveMethod: 1,
          isComplimentary: 1,
          foodPrice: 1,
          image: 1,
          isActive: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
    if (!docs[0]) return null;
    return { ...docs[0], id: docs[0]._id.toString() };
  }

  async getFoodsByAircraftId(aircraftId: string): Promise<IFood[]> {
    const docs = await FoodModel.aggregate([
      { $match: { aircraftId: this.parseId(aircraftId) } },
      {
        $project: {
          _id: 1,
          aircraftId: 1,
          providerId: 1,
          foodName: 1,
          foodType: 1,
          vegNonveg: 1,
          serveMethod: 1,
          isComplimentary: 1,
          foodPrice: 1,
          image: 1,
          isActive: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
    return docs.map((doc) => ({ ...doc, id: doc._id.toString() }));
  }

  async getFoodsByProviderId(
    providerId: string,
    page: number,
    limit: number
  ): Promise<{
    foods: IFood[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }> {
    const { pageNumber, limitNumber, skip } = paginateReq(page, limit);
    const matchStage = { providerId: this.parseId(providerId) };

    const [docs, totalCount] = await Promise.all([
      FoodModel.aggregate([
        { $match: matchStage },
        {
          $project: {
            _id: 1,
            aircraftId: 1,
            providerId: 1,
            foodName: 1,
            foodType: 1,
            vegNonveg: 1,
            serveMethod: 1,
            isComplimentary: 1,
            foodPrice: 1,
            image: 1,
            isActive: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limitNumber },
      ]),
      FoodModel.countDocuments(matchStage),
    ]);

    const paginationData = paginateRes({ totalCount, pageNumber, limitNumber });

    return {
      foods: docs.map((doc) => ({ ...doc, id: doc._id.toString() })),
      totalCount,
      currentPage: paginationData.currentPage,
      totalPages: paginationData.totalPages,
    };
  }

  async updateFood(foodId: string, data: Partial<IFood>): Promise<IFood | null> {
    const updated = await FoodModel.findByIdAndUpdate(foodId, data, {
      new: true,
    }).exec();
    if (!updated) return null;
    return this.getFoodById(updated.id.toString());
  }

  async deleteFoodById(foodId: string): Promise<IFood | null> {
    const food = await this.getFoodById(foodId);
    if (!food) return null;
    await FoodModel.findByIdAndDelete(foodId).exec();
    return food;
  }

  async getActiveFoodsByAircraftId(
    aircraftId: string,
    page: number,
    limit: number
  ): Promise<{
    foods: IFood[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }> {
    const { pageNumber, limitNumber, skip } = paginateReq(page, limit);
    const matchStage = {
      aircraftId: this.parseId(aircraftId),
      isActive: true,
    };

    const [docs, totalCount] = await Promise.all([
      FoodModel.aggregate([
        { $match: matchStage },
        {
          $project: {
            _id: 1,
            aircraftId: 1,
            providerId: 1,
            foodName: 1,
            foodType: 1,
            vegNonveg: 1,
            serveMethod: 1,
            isComplimentary: 1,
            foodPrice: 1,
            image: 1,
            isActive: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limitNumber },
      ]),
      FoodModel.countDocuments(matchStage),
    ]);

    const paginationData = paginateRes({ totalCount, pageNumber, limitNumber });

    return {
      foods: docs.map((doc) => ({ ...doc, id: doc._id.toString() })),
      totalCount,
      currentPage: paginationData.currentPage,
      totalPages: paginationData.totalPages,
    };
  }
}