import { ForbiddenError } from "@presentation/middlewares/error.middleware";
import { JWTStatus } from "@shared/constants/index.constants";
import { IAuthService } from "@application/interfaces/service/auth/IAuth.service";
import { JwtPayload } from "jsonwebtoken";
import { injectable, inject } from "inversify";
import { TYPES_SERVICES } from "@di/types-services";
import { ITokenUseCase } from "@di/file-imports-index";


/**
 * refreshAccessToken:
 * Purpose: Refresh the access token using the provided refresh token.
 * Incoming: { refreshToken } - The refresh token used to generate a new access token.
 * Returns: String - A new access token.
 * Throws: ForbiddenError if the refresh token is not provided or invalid.
 */

/**
 * authenticateAccesstoken :
 * Purpose: Authenticate and decode the provided access token.
 * Incoming: { accessToken } - The access token to authenticate and decode.
 * Returns: JwtPayload - The decoded payload from the access token.
 */

@injectable()
export class TokenUseCase implements ITokenUseCase{
  constructor(
    @inject(TYPES_SERVICES.JwtService)
    private _authService: IAuthService
  ) {}

  async refreshAccessToken(refreshToken: string): Promise<string> {
    if (!refreshToken) {
      throw new ForbiddenError(JWTStatus.NoRefreshToken);
    }
    const decoded = this._authService.authenticateRefreshToken(refreshToken);
    return this._authService.generateAccessToken({
      _id: decoded._id,
      role: decoded.role,
    });
  }
  async authAccessToken(accessToken: string): Promise<JwtPayload> {
    return this._authService.authenticateAccessToken(accessToken);
  }
}