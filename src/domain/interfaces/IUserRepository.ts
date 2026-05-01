import { IBaseRepository } from "@domain/interfaces/IBaseRepository";
import { IUser } from "@domain/entities/user.entity";

export interface IUserRepository extends IBaseRepository<IUser> {
  updateUserVerificationStatus(email: string): Promise<IUser | null>;
  
  forgotPassword(email: string, password: string,newPassword:string): Promise<IUser | null>;
  
  getAllUsers(
    page: number,
    limit: number,
    search?: string,
    filters?: string[]
  ): Promise<{
    users: IUser[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }>;
  
  updateUserActiveStatus(userId: string, isActive: boolean): Promise<boolean>;
  
  countDocs(role: string): Promise<number>;
}