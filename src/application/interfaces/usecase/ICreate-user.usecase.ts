import { CreateUserDTO } from "@application/dtos/user-dtos";
import { IUser } from "@domain/entities/user.entity";

export interface ICreateUserUseCase {
    execute(dto: CreateUserDTO): Promise<IUser>;
}
