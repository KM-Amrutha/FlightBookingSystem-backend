import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { Iuser } from "@domain/entities/user.entity";
import userModel from "@infrastructure/databases/models/user.model"


export class UserRepository implements IUserRepository {
  
  async createUser(user: Iuser): Promise<Iuser> {
    const newUser = new userModel(user);
    return newUser.save();
  }
}