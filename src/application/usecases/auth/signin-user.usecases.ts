import { 
  IUserRepository,
  IProviderRepository,
IAuthService,
IEncryptionService,
ISignInUseCase

 } from "@di/file-imports-index";

import {
  AUTH_MESSAGES,
  PASSWORD_MESSAGES,
} from "@shared/constants/index.constants";
import { SignInDTO } from "@application/dtos/auth-dtos";
import {
  ForbiddenError,
  validationError,
} from "@presentation/middlewares/error.middleware";

import { IProvider } from "@domain/entities/provider.entity";
import { IUser } from "@domain/entities/user.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";
import { UserMapper } from "@application/mappers/userMapper";
import { ProviderMapper } from "@application/mappers/providerMapper";
import { userListDTO } from "@application/dtos/user-dtos";
import { Provider } from "@application/dtos/provider-dtos";



@injectable()
export class SignInUseCase implements ISignInUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.UserRepository)
    private _userRepository: IUserRepository,
    @inject(TYPES_REPOSITORIES.ProviderRepository)
    private _providerRepository: IProviderRepository,
    @inject(TYPES_SERVICES.JwtService)
    private _authService: IAuthService,
    @inject(TYPES_SERVICES.EncryptionService)
    private _encryptionService: IEncryptionService
  ) {}


 private generateAccessToken(user: IUser | IProvider): string {
    return this._authService.generateAccessToken({
      _id: user.id.toString(),
      role: user.role,
    });
  }

   private generateRefreshToken(user: IUser | IProvider): string {
    return this._authService.generateRefreshToken({
      _id: user.id.toString(),
      role: user.role,
    });
  }
  private async validateUserLogin(
    email: string,
    password: string
  ): Promise<IUser> {
    const userData = await this._userRepository.findOne({ email: email});
    if (!userData) {
      throw new validationError(AUTH_MESSAGES.EMAIL_NOT_FOUND);
    }
  
    if (!userData?.otpVerified) {
      throw new ForbiddenError(AUTH_MESSAGES.ACCOUNT_NOT_VERIFIED);
    }
    if (!userData?.isActive) {
      throw new ForbiddenError(AUTH_MESSAGES.ACCOUNT_BLOCKED);
    }
    const isValidPassword = await this._encryptionService.compare(
      password,
      userData?.password
    );
    if (!isValidPassword) {
      throw new validationError(PASSWORD_MESSAGES.INCORRECT_PASSWORD);
    }
    return userData;
  }

    private async validateProviderLogin(
    email: string,
    password: string
  ): Promise<IProvider> {
    const providerData = await this._providerRepository.getProviderByEmailWithPassword(email);
    if (!providerData) {
      throw new validationError(AUTH_MESSAGES.EMAIL_NOT_FOUND);
    }
    if (!providerData?.isVerified) {
      throw new ForbiddenError(AUTH_MESSAGES.ACCOUNT_NOT_VERIFIED);
    }
    if (!providerData?.isActive) {
      throw new ForbiddenError(AUTH_MESSAGES.ACCOUNT_BLOCKED);
    }
    const isValidPassword = await this._encryptionService.compare(
      password,
      providerData?.password
    );
    if (!isValidPassword) {
      throw new validationError(PASSWORD_MESSAGES.INCORRECT_PASSWORD);
    }
    const providerDTO =  await this._providerRepository.getProviderByEmail(email);
    if (!providerDTO) {
    throw new validationError("Provider data not found");
  }
  return providerDTO;
  }


 async execute({ email, password }: SignInDTO): Promise<{
  accessToken: string;
  refreshToken: string;
  userData: userListDTO;
} | {
  accessToken: string;
  refreshToken: string;
  providerData: Provider;
}> {
    try {
      const userData = await this.validateUserLogin(email, password);
      // const userWithRole = { ...userData, role: "user" };
      const accessToken = this.generateAccessToken(userData);
      const refreshToken = this.generateRefreshToken(userData);
      return UserMapper.toLoginResponse(userData, accessToken, refreshToken)
     
    } catch (userError) {
      try {
        const providerData = await this.validateProviderLogin(email, password); 
        providerData.role = "provider";
        const accessToken = this.generateAccessToken(providerData);
        const refreshToken = this.generateRefreshToken(providerData);
         return ProviderMapper.toLoginResponse(providerData, accessToken, refreshToken);
      
       
      } catch (error) {
        console.error("Login error:", error);
        throw userError;
      }
    }
}


}