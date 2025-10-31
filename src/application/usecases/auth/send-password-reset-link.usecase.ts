import { IUserRepository,
IPasswordResetRepository,
IEmailService,
IHashService,
  ISendPasswordRestLinkUseCase,
 } from "@di/file-imports-index";

import { CreatePassResetTokenDTO } from "@application/dtos/auth-dtos";
import { IPasswordResetToken } from "@domain/entities/pass-reset-token.entity";
import { AuthStatus } from "@shared/constants/index.constants";
import { validationError } from "@presentation/middlewares/error.middleware";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";

@injectable()
export class SendPasswordRestLinkUseCase implements ISendPasswordRestLinkUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.UserRepository)
    private _userRepository: IUserRepository,
    @inject(TYPES_REPOSITORIES.PasswordResetRepository)
    private _passwordResetRepository: IPasswordResetRepository,
    @inject(TYPES_SERVICES.EmailService) 
    private _emailService: IEmailService,
    @inject(TYPES_SERVICES.HashService) 
    private _hashService: IHashService
  ) {}

  async execute({
    email,
  }: CreatePassResetTokenDTO): Promise<IPasswordResetToken> {
    const userData = await this._userRepository.findOne({ email: email });
    if (!userData) {
      throw new validationError(AuthStatus.EmailNotFound);
    }
  
    if (userData && !userData.otpVerified) {
      throw new validationError(AuthStatus.AccountNotVerified);
    }
    const token = await this._hashService.generate();
    const hashedToken = await this._hashService.hash(token);

    const productionUrl = process.env.CLIENT_ORIGINS;
    const resetURL = `${productionUrl}/reset-password/${token}`;
    const subject = "Password Reset";
    const text =
      `You are receiving this because you (or someone else) have requested the reset of the 
       password for your account.\n\n` +
      `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
      `${resetURL}\n\n` +
      `If you did not request this, please ignore this email and your password will remain unchanged.`;

    const [tokenData, _] = await Promise.all([
      this._passwordResetRepository.createToken({
        email,
        resetToken: hashedToken,
      }),
      this._emailService.sendEmail({ to: email, subject, text }),
    ]);

    return tokenData;
  }
}
