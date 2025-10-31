
import { IUserRepository,
  IOtpRepository,
  IEncryptionService,
  IEmailService,
  IOtpService,
ICreateUserUseCase, } from "@di/file-imports-index";

import { CreateUserDTO } from "@application/dtos/user-dtos";
import { IUser } from "@domain/entities/user.entity";
import { ApplicationStatus,
     AuthStatus } 
     from "@shared/constants/index.constants";
import { validationError } from "@presentation/middlewares/error.middleware";
import {injectable,inject} from "inversify";
import { TYPES_SERVICES } from "@di/types-services";
import { TYPES_REPOSITORIES } from "@di/types-repositories";


@injectable()
export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.UserRepository)
    private _userRepository: IUserRepository,
    @inject(TYPES_REPOSITORIES.OtpRepository)
    private _otpRepository: IOtpRepository,
    @inject(TYPES_SERVICES.EmailService)
     private _emailService: IEmailService,
    @inject(TYPES_SERVICES.OtpService) 
    private _otpService: IOtpService,
    @inject(TYPES_SERVICES.EncryptionService)
    private _encryptionService: IEncryptionService
  ) {}

  private async sendOtpEmail(email: string): Promise<void> {
    const otp = this._otpService.generateOtp(6);
    await this._otpRepository.create({ email, otp });
    await this._emailService.sendEmail({
      to: email,
      subject: "OTP for Registration",
      text: `Your OTP is ${otp}. Please do not share this OTP with anyone.`,
    });
  }

  async execute({
    firstName,
    lastName,
    email,
    password,
  }: CreateUserDTO): Promise<IUser> {
    if (!firstName || !lastName || !email || !password) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }

    const existinguser = await this._userRepository.findOne({
      email: email,
    });
    if (existinguser && existinguser.otpVerified) {
      throw new validationError(AuthStatus.EmailConflict);
    }
    if (
      existinguser &&
      !existinguser.otpVerified &&
      existinguser.googleVerified
    ) {
      throw new validationError(AuthStatus.DifferentLoginMethod);
    }
    if (existinguser && !existinguser.otpVerified) {
      await this.sendOtpEmail(email);
      return existinguser;
    }

    const hashedPassword = await this._encryptionService.hash(password);
    const userData = await this._userRepository.create({
      ...{ firstName, lastName, email },
      password: hashedPassword,
    });
    await this.sendOtpEmail(email);
    return userData;
  }
}
