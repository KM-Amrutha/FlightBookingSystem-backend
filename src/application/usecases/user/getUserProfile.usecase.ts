import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { userListDTO } from "@application/dtos/user-dtos";
import { IGetUserProfileUseCase } from "@di/file-imports-index";
import { validationError } from "@presentation/middlewares/error.middleware";
import { UserMapper } from "@application/mappers/userMapper";

@injectable()
export class GetUserProfileUseCase implements IGetUserProfileUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.UserRepository)
    private _userRepository: IUserRepository
  ) {}

  async execute(userId: string): Promise<userListDTO> {
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new validationError("User not found");
    }

    return UserMapper.toUserListDTO(user);
  }
}