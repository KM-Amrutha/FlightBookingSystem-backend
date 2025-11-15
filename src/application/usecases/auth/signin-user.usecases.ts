import { IOtpRepository,
  IUserRepository,
  IProviderRepository,
IAuthService,
IEncryptionService,
ISignInUseCase

 } from "@di/file-imports-index";

import {
  AuthStatus,
  PasswordStatus,
  ProviderStatus,
} from "@shared/constants/index.constants";
import { SignInDTO } from "@application/dtos/auth-dtos";
import {
  ForbiddenError,
  validationError,
} from "@presentation/middlewares/error.middleware";

import { Provider } from "@application/dtos/provider-dtos";
import { IUser } from "@domain/entities/user.entity";
import {IProvider} from "@domain/entities/provider.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";



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


 private generateAccessToken(user: IUser | Provider): string {
    return this._authService.generateAccessToken({
      _id: user._id.toString(),
      role: user.role,
    });
  }

   private generateRefreshToken(user: IUser | Provider): string {
    return this._authService.generateRefreshToken({
      _id: user._id.toString(),
      role: user.role,
    });
  }
  private async validateUserLogin(
    email: string,
    password: string
  ): Promise<IUser> {
    const userData = await this._userRepository.findOne({ email: email });
    if (!userData) {
      throw new validationError(AuthStatus.EmailNotFound);
    }
  
    if (!userData?.otpVerified) {
      throw new ForbiddenError(AuthStatus.AccountNotVerified);
    }
    if (!userData?.isActive) {
      throw new ForbiddenError(AuthStatus.AccountBlocked);
    }
    const isValidPassword = await this._encryptionService.compare(
      password,
      userData?.password
    );
    if (!isValidPassword) {
      throw new validationError(PasswordStatus.Incorrect);
    }
    return userData;
  }

    private async validateProviderLogin(
    email: string,
    password: string
  ): Promise<Provider> {
    const providerData = await this._providerRepository.getProviderByEmailWithPassword(email);
    if (!providerData) {
      throw new validationError(AuthStatus.EmailNotFound);
    }
    if (!providerData?.isVerified) {
      throw new ForbiddenError(AuthStatus.AccountNotVerified);
    }
    if (!providerData?.isActive) {
      throw new ForbiddenError(AuthStatus.AccountBlocked);
    }
    const isValidPassword = await this._encryptionService.compare(
      password,
      providerData?.password
    );
    if (!isValidPassword) {
      throw new validationError(PasswordStatus.Incorrect);
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
    userData: IUser | Provider;
  }> {
    try {
      const userData = await this.validateUserLogin(email, password);
      // const userWithRole = { ...userData, role: "user" };
      const accessToken = this.generateAccessToken(userData);
      const refreshToken = this.generateRefreshToken(userData);
      return { accessToken, refreshToken, userData};
    } catch (userError) {
      try {
        const providerData = await this.validateProviderLogin(email, password); 
        providerData.role = "provider";
        const accessToken = this.generateAccessToken(providerData);
        const refreshToken = this.generateRefreshToken(providerData);
        return { accessToken, refreshToken, userData: providerData };
      } catch (providerError) {
        throw userError;
      }
    }
}


}