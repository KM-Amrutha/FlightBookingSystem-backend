import { IOtpRepository ,
  IUserRepository,
  IProviderRepository,
  IEmailService,
  IOtpService,
  IOtpUseCase,

} from "@di/file-imports-index";

import { OtpDTO } from "@application/dtos/auth-dtos";
import { OTPStatus } from "@shared/constants/index.constants";
import { validationError } from "@presentation/middlewares/error.middleware";
import { IOtp } from "@domain/entities/otp.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";

@injectable()
export class OtpUseCase implements IOtpUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.OtpRepository)
    private _otpRepository: IOtpRepository,
    @inject(TYPES_REPOSITORIES.UserRepository)
    private _userRepository: IUserRepository,
    @inject(TYPES_REPOSITORIES.ProviderRepository)
    private _providerRepository: IProviderRepository,
    @inject(TYPES_SERVICES.EmailService)
    private _emailService: IEmailService,
    @inject(TYPES_SERVICES.OtpService)
    private _otpService: IOtpService
  ) {}

  async createOtp({ email, otp }: OtpDTO): Promise<IOtp> {
    return await this._otpRepository.create({ email, otp });
  }

  async verifyOtp({ email, otp }: OtpDTO): Promise<void> {
    const otpData = await this._otpRepository.findOne({ email, otp });

    if (!otpData) {
      throw new validationError(OTPStatus.Invalid);
    }

    const { email: userEmail } = otpData;

    const userData = await this._userRepository.findOne({ email: userEmail });
    const providerData = await this._providerRepository.getProviderByEmail(userEmail);

    if (userData) {
      await this._userRepository.updateUserVerificationStatus({
        email: userEmail,
      });
    }

    if (providerData) {
      await this._providerRepository.updateVerificationStatus(providerData._id, true);
    }

    if (!userData && !providerData) {
      throw new validationError("No user or provider found with this email");
    }

    await this._otpRepository.delete(String(otpData?._id));
  }

  async resendOtp({ email }: { email: string }): Promise<void> {
    const userData = await this._userRepository.findOne({ email });
    const providerData = await this._providerRepository.getProviderByEmail(email);

    if (!userData && !providerData) {
      throw new validationError("No account found with this email");
    }
    if (userData?.otpVerified || providerData?.isVerified) {
      throw new validationError(OTPStatus.Verified);
    }

    
    const newOtp = this._otpService.generateOtp(6);
    
    
    const existingOtp = await this._otpRepository.findOne({ email });
    if (existingOtp) {
      await this._otpRepository.delete(String(existingOtp._id));
    }

    await this._otpRepository.create({ email, otp: newOtp });

    const entityType = userData ? "user" : "provider";
    await this._emailService.sendEmail({
      to: email,
      subject: `OTP for ${entityType.charAt(0).toUpperCase() + entityType.slice(1)} Registration`,
      text: `Your OTP is ${newOtp}. Please do not share this OTP with anyone.`,
    });
  }
}
