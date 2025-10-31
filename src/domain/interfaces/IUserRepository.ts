import { IBaseRepository } from "@domain/interfaces/IBaseRepository"
import { IUser } from "@domain/entities/user.entity"
import { FindEmailDTO,UpdatePasswordDTO } from "@application/dtos/auth-dtos";

export interface IUserRepository extends IBaseRepository<IUser>{
      
       updateUserVerificationStatus(data: FindEmailDTO): Promise<IUser | null>;
  forgotPassword(data: UpdatePasswordDTO): Promise<IUser | null>;
  

}