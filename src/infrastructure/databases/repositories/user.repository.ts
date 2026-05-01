import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { IUser } from "@domain/entities/user.entity";
import {BaseRepository} from "@infrastructure/databases/repositories/base.repository";

import UserModel from "@infrastructure/databases/models/user.model";
import { paginateReq,paginateRes } from "@shared/utils/pagination";




export class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }

  
 async updateUserVerificationStatus( email: string): Promise<IUser | null> {
    return await UserModel
      .findOneAndUpdate({ email }, { otpVerified: true })
      .lean()
      .exec() as IUser | null;
  }

  async forgotPassword(
    email: string,
    password: string,
    newPassword: string
  ): Promise<IUser | null> {
    return (await UserModel
      .findOneAndUpdate(
        { email, password },
        { password: newPassword },
        { new: true }
      )
      .lean()
      .exec()) as IUser | null;
  }


   async updateUserActiveStatus(userId: string, isActive: boolean): Promise<boolean> {
    const result = await UserModel.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    ).exec();
    return result !== null;
  }
async getAllUsers(
  page: number,
  limit: number,
  search?: string,
  filters?: string[]
): Promise<{
  users: IUser[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}> {
  const { pageNumber, limitNumber, skip } = paginateReq(page, limit);
  const matchquery = { role: "user" } as const;

  if (search) {
    Object.assign(matchquery, {
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    });
  }

  if (filters && filters.length > 0 && !filters.includes("All")) {
    const conditions: Record<string, unknown>[] = [];

    if (filters.includes("Active")) conditions.push({ isActive: true });
    if (filters.includes("Inactive")) conditions.push({ isActive: false });
    if (filters.includes("verified"))
      conditions.push({
        $or: [{ otpVerified: true }, { googleVerified: true }],
      });
    if (filters.includes("Not verified"))
      conditions.push({
        $and: [{ otpVerified: false }, { googleVerified: false }],
      });

    if (conditions.length > 0) {
      Object.assign(matchquery , { $and: conditions });
    }
  }

  const totalCount = await UserModel.countDocuments(matchquery);

  const rawUsers = await UserModel
    .find(matchquery)
    .skip(skip)
    .limit(limitNumber)
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  const users: IUser[] = rawUsers.map((user) => {
    if (
      typeof user === "object" &&
      user !== null &&
      "_id" in user
    ) {
      const { _id, ...rest } = user as {
        _id: { toString(): string };
        __v?: number;
      };

      return {
        ...(rest as Omit<IUser, "id">),
        id: _id.toString(),
      };
    }

    throw new Error("Invalid user document shape");
  });

  const pagination = paginateRes({
    totalCount,
    pageNumber,
    limitNumber,
  });

  return {
    users,
    totalCount,
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
  };
}



 async countDocs(role: string): Promise<number> {
    return await UserModel.countDocuments({ role: role });
  }

}

