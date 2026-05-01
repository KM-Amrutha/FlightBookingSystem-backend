import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { ICloudStorageService } from "@di/file-imports-index";
import { userListDTO, UpdateUserProfileDTO } from "@application/dtos/user-dtos";
import { IUpdateUserProfileUseCase } from "@di/file-imports-index";
import { validationError } from "@presentation/middlewares/error.middleware";
import { UserMapper } from "@application/mappers/userMapper";

@injectable()
export class UpdateUserProfileUseCase implements IUpdateUserProfileUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.UserRepository)
    private _userRepository: IUserRepository,
    @inject(TYPES_SERVICES.CloudinaryService)
    private _cloudStorageService: ICloudStorageService
  ) {}

  private async uploadToCloud(image: string, folder: string): Promise<string> {
    if (image && !image.includes("cloudinary.com")) {
      return await this._cloudStorageService.uploadImage({ image, folder });
    }
    return image;
  }

  async execute(data: UpdateUserProfileDTO): Promise<userListDTO> {
    const { userId, profilePicture, ...rest } = data;

    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new validationError("User not found");
    }

    let resolvedProfilePicture = user.profilePicture;

    if (profilePicture) {
      resolvedProfilePicture = await this.uploadToCloud(
        profilePicture,
        `skylife/users/${userId}/profile`
      );
    }

    const updated = await this._userRepository.update(userId, {
      ...rest,
      ...(resolvedProfilePicture && { profilePicture: resolvedProfilePicture }),
    });

    if (!updated) {
      throw new validationError("Failed to update user profile");
    }

    return UserMapper.toUserListDTO(updated);
  }
}