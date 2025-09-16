import { IBaseRepository } from "@domain/interfaces/IBaseRepository"
import { Iuser } from "@domain/entities/user.entity"

export interface IUserRepository extends IBaseRepository<Iuser>{
      createUser(user: Iuser): Promise<Iuser>;

}