import { IProvider } from "@domain/entities/provider.entity";
import { Provider } from "@application/dtos/provider-dtos";

export class ProviderMapper {
  /**
   * Convert IProvider entity to Provider DTO
   * Used by: GetProviderProfileUseCase, GetAllProvidersUseCase etc.
   */
  static toProviderDTO(provider: IProvider): Provider {
    return {
      _id: provider.id,
      role: provider.role,
      companyName: provider.companyName,
      email: provider.email,
      mobile: provider.mobile,
      airlineCode: provider.airlineCode,
      isActive: provider.isActive,
      isVerified: provider.isVerified,
      profileStatus: provider.profileStatus,
      createdAt: provider.createdAt,
      updatedAt: provider.updatedAt,
      ...(provider.logoUrl && { logoUrl: provider.logoUrl }),
      ...(provider.registrationCertificateUrl && { registrationCertificateUrl: provider.registrationCertificateUrl }),
      ...(provider.insuranceProofUrl && { insuranceProofUrl: provider.insuranceProofUrl }),
      ...(provider.establishmentYear && { establishmentYear: provider.establishmentYear }),
      ...(provider.licenseExpiryDate && { licenseExpiryDate: provider.licenseExpiryDate }),
      ...(provider.headquartersAddress && { headquartersAddress: provider.headquartersAddress }),
      ...(provider.countryOfOperation && { countryOfOperation: provider.countryOfOperation }),
      ...(provider.typeOfOperation && { typeOfOperation: provider.typeOfOperation }),
      ...(provider.websiteUrl && { websiteUrl: provider.websiteUrl }),
      ...(provider.ceoName && { ceoName: provider.ceoName }),
      ...(provider.officeContactNumber && { officeContactNumber: provider.officeContactNumber }),
      ...(provider.rejectionReason !== undefined && { rejectionReason: provider.rejectionReason }),
      ...(provider.rejectionDate !== undefined && { rejectionDate: provider.rejectionDate }),
    };
  }

  /**
   * Convert array of IProvider entities to Provider DTOs
   * Used by: GetAllProvidersUseCase, GetPendingProvidersUseCase
   */
  static toProviderDTOs(providers: IProvider[]): Provider[] {
    return providers.map((provider) => this.toProviderDTO(provider));
  }

  /**
   * Create login response with provider and tokens
   * Used by: SignInUseCase
   */
  static toLoginResponse(provider: IProvider, accessToken: string, refreshToken: string): {
    providerData: Provider;
    accessToken: string;
    refreshToken: string;
  } {
    return {
      providerData: this.toProviderDTO(provider), // ✅ DTO not entity
      accessToken,
      refreshToken,
    };
  }

  /**
   * Create profile response
   * Used by: GetProviderProfileUseCase, UpdateProviderProfileUseCase
   */
  static toProfileResponse(provider: IProvider): { provider: Provider } {
    return {
      provider: this.toProviderDTO(provider), // ✅ DTO not entity
    };
  }

  /**
   * Create paginated providers list response
   * Used by: GetAllProvidersUseCase (Admin)
   */
  static toPaginatedResponse(
    providers: IProvider[],
    totalCount: number,
    currentPage: number,
    totalPages: number
  ) {
    return {
      providers: this.toProviderDTOs(providers),
      totalCount,
      currentPage,
      totalPages,
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