import { IUser } from "@domain/entities/user.entity";
import { userListDTO } from "@application/dtos/user-dtos";

export class UserMapper {
  /**
   * Convert IUser entity to userListDTO
   * Used by: GetAllUsersUseCase, GetUserProfileUseCase, UpdateUserProfileUseCase
   */
  static toUserListDTO(user: IUser): userListDTO {
    return {
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isActive: user.isActive,
      role: user.role,
      otpVerified: user.otpVerified,
      googleVerified: user.googleVerified,
      createdAt: user.createdAt,
      ...(user.mobile && { mobile: user.mobile }),
      ...(user.dateOfBirth && { dateOfBirth: user.dateOfBirth }),
      ...(user.gender && { gender: user.gender }),
      ...(user.profilePicture && { profilePicture: user.profilePicture }),
      ...(user.address1 && { address1: user.address1 }),
      ...(user.address2 && { address2: user.address2 }),
    };
  }

  /**
   * Convert array of IUser to userListDTO[]
   * Used by: GetAllUsersUseCase
   */
  static toUserListDTOs(users: IUser[]): userListDTO[] {
    return users.map((user) => this.toUserListDTO(user));
  }

  /**
   * Create login response with user and tokens
   * Used by: SignInUseCase, GoogleAuthUseCase
   */
  static toLoginResponse(user: IUser, accessToken: string, refreshToken: string): {
    userData: userListDTO;
    accessToken: string;
    refreshToken: string;
  } {
    return {
      userData: this.toUserListDTO(user),
      accessToken,
      refreshToken,
    };
  }

  /**
   * Create user profile response
   * Used by: GetUserProfileUseCase, UpdateUserProfileUseCase
   */
  static toProfileResponse(user: IUser): { user: userListDTO } {
    return {
      user: this.toUserListDTO(user), // ✅ DTO not entity
    };
  }

  /**
   * Create token refresh response
   * Used by: RefreshTokenUseCase
   */
  static toTokenRefreshResponse(accessToken: string, refreshToken: string) {
    return {
      accessToken,
      refreshToken,
    };
  }
}