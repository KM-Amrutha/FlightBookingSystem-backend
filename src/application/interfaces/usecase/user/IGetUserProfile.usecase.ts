import { userListDTO } from "@application/dtos/user-dtos";

export interface IGetUserProfileUseCase {
  execute(userId: string): Promise<userListDTO>;
}