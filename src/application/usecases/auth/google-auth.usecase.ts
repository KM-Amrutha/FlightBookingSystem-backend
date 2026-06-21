import {
  IUserRepository,
  IAuthService,
  IGoogleAuthService,
} from "@di/file-imports-index";
import { GoogleTokenDTO } from "@application/dtos/auth-dtos";
import {
  ForbiddenError,
  validationError,
} from "@presentation/middlewares/error.middleware";
import { AUTH_MESSAGES } from "@shared/constants/index.constants";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";
import { UserMapper } from "@application/mappers/userMapper";
import { userListDTO } from "@application/dtos/user-dtos";

// ── token payload type — keeps entity types out of usecase ───────────────────
interface TokenPayload {
  id: string;
  role: string;
}

@injectable()
export class GoogleAuthUseCase {  
  constructor(
    @inject(TYPES_REPOSITORIES.UserRepository)
    private _userRepository: IUserRepository,            
    @inject(TYPES_SERVICES.JwtService)
    private _authService: IAuthService,                  
    @inject(TYPES_SERVICES.GoogleAuthService)
    private _googleAuthService: IGoogleAuthService    
  ) {}

  
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
  
  private generateAccessToken(payload: TokenPayload): string {
    return this._authService.generateAccessToken({
      id: payload.id,
      role: payload.role,
    });
  }

  private generateRefreshToken(payload: TokenPayload): string {
    return this._authService.generateRefreshToken({
      id: payload.id,
      role: payload.role,
    });
  }

  async execute({ token }: GoogleTokenDTO): Promise<{
    accessToken: string;
    refreshToken: string;
    userData: userListDTO;
  }> {
    const payload = await this._googleAuthService.verifyToken(token);

    if (!payload?.email || !payload.email_verified) {
      throw new validationError(AUTH_MESSAGES.EMAIL_NOT_FOUND);
    }

    const { email, name, given_name, family_name, picture } = payload;

    const existingUser = await this._userRepository.findOne({ email });

    if (existingUser) {
      if (!existingUser.isActive) {
        throw new ForbiddenError(AUTH_MESSAGES.ACCOUNT_BLOCKED);
      }

    
      if (!existingUser.googleVerified) {
        await this._userRepository.update(existingUser.id.toString(), {
          googleVerified: true,
        });
      }


      const updatedUser = await this._userRepository.findOne({ email });
      if (!updatedUser) throw new validationError(AUTH_MESSAGES.EMAIL_NOT_FOUND);

      const tokenPayload: TokenPayload = {
        id: updatedUser.id.toString(),
        role: updatedUser.role,
      };

      return UserMapper.toLoginResponse(
        updatedUser,
        this.generateAccessToken(tokenPayload),
        this.generateRefreshToken(tokenPayload)
      );
    }

    // ── new Google user — entity shape built inline, no Partial<IUser> ────
    const firstName = given_name ?? name?.split(" ")[0] ?? "User";
    const lastName = family_name ?? name?.split(" ").slice(1).join(" ") ?? "";

    const newUser = await this._userRepository.create({
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
      ...(picture && { profilePicture: picture }),
    });

    const tokenPayload: TokenPayload = {
      id: newUser.id.toString(),
      role: newUser.role,
    };

    return UserMapper.toLoginResponse(
      newUser,
      this.generateAccessToken(tokenPayload),
      this.generateRefreshToken(tokenPayload)
    );
  }
}