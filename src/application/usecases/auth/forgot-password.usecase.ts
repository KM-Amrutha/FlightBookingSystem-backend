import { IUserRepository,
     IPasswordResetRepository,
    IEncryptionService,
    IHashService,
   IForgotPasswordUseCase,

 } from "@di/file-imports-index";

import { PasswordResetDTO } from "@application/dtos/auth-dtos";
import { AUTH_MESSAGES, PASSWORD_MESSAGES } from "@shared/constants/index.constants";
import { validationError } from "@presentation/middlewares/error.middleware";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";


@injectable()
export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.UserRepository)
    private _userRepository: IUserRepository,
    @inject(TYPES_REPOSITORIES.PasswordResetRepository)
    private _passwordResetRepository: IPasswordResetRepository,
    @inject(TYPES_SERVICES.EncryptionService)
    private _encryptionService: IEncryptionService,
    @inject(TYPES_SERVICES.HashService) 
    private _hashService: IHashService
  ) {}

  async execute({ resetToken, password }: PasswordResetDTO): Promise<void> {
    const token = await this._hashService.hash(resetToken);
    const tokenData = await this._passwordResetRepository.findOne({
      resetToken: token,
    });

    if (!tokenData) {
      throw new validationError(PASSWORD_MESSAGES.LINK_EXPIRED);
    }
    const { email } = tokenData;
    const userData = await this._userRepository.findOne({ email });
    if (!userData) {
      throw new validationError(AUTH_MESSAGES.EMAIL_NOT_FOUND);
    }
    if (password) {
      const hashedPassword = await this._encryptionService.hash(password);
      await this._userRepository.forgotPassword(
        email,
        userData.password,
         hashedPassword,
      );
    }
  }
}
