import { CreateUserDTO, 
    userListDTO } from "@application/dtos/user-dtos";

export interface ICreateUserUseCase {
  execute(dto: CreateUserDTO): Promise<userListDTO>;
}