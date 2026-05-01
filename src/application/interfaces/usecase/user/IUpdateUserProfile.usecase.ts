import { userListDTO, UpdateUserProfileDTO } from "@application/dtos/user-dtos";

export interface IUpdateUserProfileUseCase {
  execute(data: UpdateUserProfileDTO): Promise<userListDTO>;
}