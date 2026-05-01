import { GoogleTokenDTO } from "@application/dtos/auth-dtos";
import {
  ForbiddenError,
  validationError,
} from "@presentation/middlewares/error.middleware";
import { AUTH_MESSAGES } from "@shared/constants/index.constants";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { IAuthService } from "@application/interfaces/service/auth/IAuth.service";
import { IGoogleAuthService } from "@application/interfaces/service/auth/IGoogle.auth.service";
import { IUser } from "@domain/entities/user.entity";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";
import { UserMapper } from "@application/mappers/userMapper";
import { userListDTO } from "@application/dtos/user-dtos";

/*  
    Purpose: Handles the Google authentication process. It verifies the provided Google token, 
             checks for existing users in the system, and creates or returns user data along with 
             generated access and refresh tokens.
    Incoming: { token } (Google OAuth token provided by the client)
    Returns: { accessToken, refreshToken, userData } (Generated access and refresh tokens, and user data)
    Throws:
        - validationError if the Google user information is invalid or missing email.
        - ForbiddenError if the user's account is blocked.
        - validationError if the user attempts to log in via Google with a different login method 
          already used (OTP not verified).
*/

@injectable()
export class GoogleAuthUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.UserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES_SERVICES.JwtService) 
    private authService: IAuthService,
    @inject(TYPES_SERVICES.GoogleAuthService)
    private googleAuthService: IGoogleAuthService
  ) {}

  private generateAccessToken(user: IUser): string {
    return this.authService.generateAccessToken({
      _id: user.id.toString(),
      role: user.role,
    });
  }
  private generateRefreshToken(user: IUser): string {
    return this.authService.generateRefreshToken({
      _id: user.id.toString(),
      role: user.role,
    });
  }
async execute({ token }: GoogleTokenDTO): Promise<{
  accessToken: string;
  refreshToken: string;
   userData: userListDTO;
  
}> {
  const payload = await this.googleAuthService.verifyToken(token);

  if (!payload?.email || !payload.email_verified) {
    throw new validationError(AUTH_MESSAGES.EMAIL_NOT_FOUND);
  }

  const { email, name, given_name, family_name, picture } = payload;

  let userData = await this.userRepository.findOne({ email });

  if (userData && !userData.isActive) {
    throw new ForbiddenError(AUTH_MESSAGES.ACCOUNT_BLOCKED);
  }

 if (userData) {
  if (!userData.googleVerified) {
    await this.userRepository.update(userData.id.toString(), { googleVerified: true });
    userData.googleVerified = true;
  }

  const accessToken = this.generateAccessToken(userData);
  const refreshToken = this.generateRefreshToken(userData);
 return UserMapper.toLoginResponse( userData, accessToken, refreshToken);
  

}

// New Google user - this compiles clean
const firstName = given_name ?? name?.split(' ')[0] ?? "User";
const lastName = family_name ?? name?.split(' ').slice(1).join(' ') ?? "";

const userObj: Partial<IUser> = {
  email,
  firstName,
  lastName,
  password: "",
  mobile: "",
  role: "user",
  isActive: true,
  otpVerified: false,
  googleVerified: true,
  dateOfBirth: "",
  gender: "male",
  address1: "",
  address2: "",
  isVerified: true,
};

if (picture) {
  userObj.profilePicture = picture; 
}


userData = await this.userRepository.create(userObj);

const accessToken = this.generateAccessToken(userData);
const refreshToken = this.generateRefreshToken(userData);

 return UserMapper.toLoginResponse(userData, accessToken, refreshToken);

}
  
}
