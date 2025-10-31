import {IUserRepository ,
IProviderRepository,
 IOtpRepository,
 IEmailService,
 IEncryptionService,
 IOtpService,
 ICreateProviderUseCase

 } from "@di/file-imports-index";
 import { ApplicationStatus,
         AuthStatus
 } from "@shared/constants/index.constants";
import { Provider, CreateProviderDTO } from "@application/dtos/provider-dtos";
import {validationError} from "@presentation/middlewares/error.middleware";
import {IUser} from "@domain/entities/user.entity";
import { inject,injectable } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";




@injectable()
export class CreateProviderUseCase implements ICreateProviderUseCase {
    constructor(
         @inject(TYPES_REPOSITORIES.UserRepository)
    private _userRepository: IUserRepository,
    @inject(TYPES_REPOSITORIES.OtpRepository)
    private _otpRepository: IOtpRepository,
    @inject(TYPES_REPOSITORIES.ProviderRepository)
    private _providerRepository: IProviderRepository,
    @inject(TYPES_SERVICES.EmailService) private emailService: IEmailService,
    @inject(TYPES_SERVICES.OtpService) private otpService: IOtpService,
    @inject(TYPES_SERVICES.EncryptionService)
    private _encryptionService: IEncryptionService

    ){}


 private async sendOtpEmail(email: string): Promise<void> {
    const otp = this.otpService.generateOtp(6);
    await this._otpRepository.create({ email, otp });
    await this.emailService.sendEmail({
      to: email,
      subject: "OTP for Registration",
      text: `Your OTP is ${otp}. Please do not share this OTP with anyone.`,
    });
  }

  async execute({
    companyName,
    email,
    mobile,
    password,
    airlineCode,
    establishment_year,
    license_expiry_date,
    headquarters_address,
    country_of_operation,
    type_of_operation,
    website_url,
    ceo_name,
    office_contact_number,
    isActive,
  isVerified
  }: CreateProviderDTO): Promise<Provider | IUser> {
    if (
        !companyName ||
        !email ||
        !mobile ||
        !password ||
        !airlineCode 
    ) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }

    const existinguser = await this._userRepository.findOne({
      email: email,
    });
    if (existinguser && existinguser.otpVerified) {
      throw new validationError(AuthStatus.EmailConflict);
    }

    const existingAirlineCode = await this._providerRepository.getProviderByAirlineCode(airlineCode);
    if (existingAirlineCode) {
      throw new validationError("Airline code already exists");
    }
   
    if (existinguser && !existinguser.otpVerified) {
      await this.sendOtpEmail(email);
      return existinguser;
    }
     const hashedPassword = await this._encryptionService.hash(password);

    const providerData: CreateProviderDTO = {
      companyName,
      email,
      mobile,
      password: hashedPassword,
      airlineCode,
      establishment_year,
      license_expiry_date,
      headquarters_address,
      country_of_operation,
      type_of_operation,
      website_url,
      ceo_name,
      office_contact_number,
      isActive: true,
      isVerified: true 
    };

    const createdProvider = await this._providerRepository.createProvider(providerData);

    await this.sendOtpEmail(email);

    return createdProvider;
  }
   
    
  }
















