import {IUserRepository ,
IProviderRepository,
 IOtpRepository,
 IEmailService,
 IEncryptionService,
 IOtpService,
 ICreateProviderUseCase

 } from "@di/file-imports-index";
 import { APPLICATION_MESSAGES,
         AUTH_MESSAGES
 } from "@shared/constants/index.constants";
import { CreateProviderDTO, Provider } from "@application/dtos/provider-dtos";
import {validationError} from "@presentation/middlewares/error.middleware";
import { inject,injectable } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";
import { ProviderMapper } from "@application/mappers/providerMapper";
import { UserMapper } from "@application/mappers/userMapper";
import { userListDTO } from "@application/dtos/user-dtos";




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
    isActive,
  isVerified
  }: CreateProviderDTO): Promise<Provider | userListDTO> {
    if (
        !companyName ||
        !email ||
        !mobile ||
        !password ||
        !airlineCode 
    ) {
      throw new validationError(APPLICATION_MESSAGES.ALL_FIELDS_ARE_REQUIRED);
    }

    const existingUser = await this._userRepository.findOne({
      email: email,
    });
    if (existingUser && existingUser.otpVerified) {
      throw new validationError(AUTH_MESSAGES.EMAIL_CONFLICT);
    }

    const existingAirlineCode = await this._providerRepository.getProviderByAirlineCode(airlineCode);
    if (existingAirlineCode) {
      throw new validationError("Airline code already exists");
    }
   
    if (existingUser && !existingUser.otpVerified) {
      await this.sendOtpEmail(email);

      return UserMapper.toUserListDTO(existingUser);
       
      
    }
     const hashedPassword = await this._encryptionService.hash(password);

    const providerData: CreateProviderDTO = {
      companyName,
      email,
      mobile,
      password: hashedPassword,
      airlineCode,
      isActive: true,
      isVerified: true,
    
    };

    const createdProvider = await this._providerRepository.createProvider(providerData);

    await this.sendOtpEmail(email);
    return ProviderMapper.toProviderDTO(createdProvider)
 
    
  }
   
    
  }
















