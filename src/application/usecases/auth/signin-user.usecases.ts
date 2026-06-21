import {
  IUserRepository,
  IProviderRepository,
  IAuthService,
  IEncryptionService,
  ISignInUseCase,
} from "@di/file-imports-index";
import {
  AUTH_MESSAGES,
  PASSWORD_MESSAGES,
  PROVIDER_MESSAGES,
} from "@shared/constants/index.constants";
import { SignInDTO } from "@application/dtos/auth-dtos";
import {
  ForbiddenError,
  validationError,
} from "@presentation/middlewares/error.middleware";
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";
import { UserMapper } from "@application/mappers/userMapper";
import { ProviderMapper } from "@application/mappers/providerMapper";
import { userListDTO } from "@application/dtos/user-dtos";
import { Provider } from "@application/dtos/provider-dtos";

// ── token payload type — keeps entity types out of usecase ───────────────────
interface TokenPayload {
  id: string;
  role: string;
}

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

  // ✅ accepts plain payload — no entity type needed
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

  // ✅ return type inferred from repo — no IUser import needed
  private async validateUserLogin(email: string, password: string) {
    const userData = await this._userRepository.findOne({ email });
    if (!userData) throw new validationError(AUTH_MESSAGES.EMAIL_NOT_FOUND);
    if (!userData.otpVerified) throw new ForbiddenError(AUTH_MESSAGES.ACCOUNT_NOT_VERIFIED);
    if (!userData.isActive) throw new ForbiddenError(AUTH_MESSAGES.ACCOUNT_BLOCKED);

    const isValidPassword = await this._encryptionService.compare(
      password,
      userData.password
    );
    if (!isValidPassword) throw new validationError(PASSWORD_MESSAGES.INCORRECT_PASSWORD);

    return userData;
  }

  // ✅ return type inferred from repo — no IProvider import needed
  // ✅ single repo fetch — no double fetch
  private async validateProviderLogin(email: string, password: string) {
    const providerData =
      await this._providerRepository.getProviderByEmailWithPassword(email);
    if (!providerData) throw new validationError(AUTH_MESSAGES.EMAIL_NOT_FOUND);
    if (!providerData.isVerified) throw new ForbiddenError(AUTH_MESSAGES.ACCOUNT_NOT_VERIFIED);
    if (!providerData.isActive) throw new ForbiddenError(AUTH_MESSAGES.ACCOUNT_BLOCKED);

    const isValidPassword = await this._encryptionService.compare(
      password,
      providerData.password
    );
    if (!isValidPassword) throw new validationError(PASSWORD_MESSAGES.INCORRECT_PASSWORD);

    // ✅ re-fetch clean provider without password field — no mutation
    const cleanProvider = await this._providerRepository.getProviderByEmail(email);
    if (!cleanProvider) throw new validationError(PROVIDER_MESSAGES.PROVIDER_NOT_FOUND); 

    return cleanProvider;
  }

  async execute({ email, password }: SignInDTO): Promise<
    | { accessToken: string; refreshToken: string; userData: userListDTO }
    | { accessToken: string; refreshToken: string; providerData: Provider }
  > {
    // ── try user first ────────────────────────────────────────────────────
    const user = await this._userRepository.findOne({ email });

    if (user) {
      // ✅ proper control flow — check role before attempting login
      const userData = await this.validateUserLogin(email, password);
      const payload: TokenPayload = { id: userData.id.toString(), role: userData.role };
      const accessToken = this.generateAccessToken(payload);
      const refreshToken = this.generateRefreshToken(payload);
      return UserMapper.toLoginResponse(userData, accessToken, refreshToken);
    }

    // ── try provider ──────────────────────────────────────────────────────
    const providerExists = await this._providerRepository.getProviderByEmail(email);

    if (providerExists) {
      const providerData = await this.validateProviderLogin(email, password);
      const payload: TokenPayload = { id: providerData.id.toString(), role: providerData.role };
      const accessToken = this.generateAccessToken(payload);
      const refreshToken = this.generateRefreshToken(payload);
      return ProviderMapper.toLoginResponse(providerData, accessToken, refreshToken);
    }

    // ── email not found in either collection ──────────────────────────────
    throw new validationError(AUTH_MESSAGES.EMAIL_NOT_FOUND);
  }
}