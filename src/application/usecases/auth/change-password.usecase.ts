import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { IProviderRepository } from "@domain/interfaces/IProviderRepository";
import { IEncryptionService } from "@di/file-imports-index";
import { ChangePasswordDTO } from "@application/dtos/auth-dtos";
import { IChangePasswordUseCase } from "@application/interfaces/usecase/auth/IChange-password.usecase";
import { validationError } from "@presentation/middlewares/error.middleware";
import { PASSWORD_MESSAGES } from "@shared/constants/index.constants";

@injectable()
export class ChangePasswordUseCase implements IChangePasswordUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.UserRepository)
    private _userRepository: IUserRepository,
    @inject(TYPES_REPOSITORIES.ProviderRepository)
    private _providerRepository: IProviderRepository,
    @inject(TYPES_SERVICES.EncryptionService)
    private _encryptionService: IEncryptionService
  ) {}

  async execute({ userId, password, newPassword }: ChangePasswordDTO): Promise<void> {
    const [user, provider] = await Promise.all([
      this._userRepository.findById(userId),
      this._providerRepository.findById(userId),
    ]);

    const account = user ?? provider;

    if (!account) {
      throw new validationError("Account not found");
    }

    const isMatch = await this._encryptionService.compare(password, account.password);

    if (!isMatch) {
      throw new validationError(PASSWORD_MESSAGES.INCORRECT_PASSWORD);
    }

    const hashed = await this._encryptionService.hash(newPassword);

    if (user) {
      await this._userRepository.update(userId, { password: hashed });
    } else {
      await this._providerRepository.update(userId, { password: hashed });
    }
  }
}