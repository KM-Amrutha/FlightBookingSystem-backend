import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { IUser } from "@domain/entities/user.entity";
import UserModel from "@infrastructure/databases/models/user.model";
import { Model } from "mongoose";
import {BaseRepository} from "@infrastructure/databases/repositories/base.repository";
import { FindEmailDTO,UpdatePasswordDTO } from "@application/dtos/auth-dtos";


export class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository
{
  constructor( model: Model<IUser> = UserModel) {
    super(model);
  }

  
  async updateUserVerificationStatus({
    email,
  }: FindEmailDTO): Promise<IUser | null> {
    return await this.model
      .findOneAndUpdate({ email }, { otpVerified: true })
      .lean();
  }


  async forgotPassword({
    email,
    password,
  }: UpdatePasswordDTO): Promise<IUser | null> {
    return await this.model
      .findOneAndUpdate({ email }, { password: password })
      .lean();
  }

}
