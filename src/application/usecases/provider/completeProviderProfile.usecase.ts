import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";
import { IProviderRepository } from "@domain/interfaces/IProviderRepository";
import { ICloudStorageService } from "@di/file-imports-index";
import { UpdateProviderDTO } from "@application/dtos/provider-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import { ICompleteProviderProfileUseCase } from "@application/interfaces/usecase/ICompleteProvider-profileUsecase";

@injectable()
export class CompleteProviderProfileUseCase implements ICompleteProviderProfileUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.ProviderRepository)
    private _providerRepository: IProviderRepository,
    @inject(TYPES_SERVICES.CloudinaryService)
    private _cloudStorageService: ICloudStorageService
  ) {}

  // Upload to Cloudinary only if it's base64 (not already a Cloudinary URL)
  private async uploadToCloud(image: string, folder: string): Promise<string> {
    if (image && !image.includes("cloudinary.com")) {
      return await this._cloudStorageService.uploadImage({ image, folder });
    }
    return image;
  }

  async execute(providerId: string, profileData: {
    companyName?: string;
    email?: string;
    mobile?: string;
    airlineCode?: string;
    logoUrl?: string;
    registration_certificateUrl?: string;
    insuranceProofUrl?: string;
    establishmentYear: number;
    licenseExpiryDate: Date;
    headquartersAddress: string;
    countryOfOperation: string;
    typeOfOperation: string;
    websiteUrl: string;
    ceoName: string;
    officeContactNumber: string;
  }): Promise<void> {
    const provider = await this._providerRepository.findById(providerId);
    
    if (!provider) {
      throw new validationError("Provider not found");
    }

    const {
      companyName,
      email,
      mobile,
      airlineCode,
      logoUrl,
      registration_certificateUrl,
      insuranceProofUrl,
      establishmentYear,
      licenseExpiryDate,
      headquartersAddress,
      countryOfOperation,
      typeOfOperation,
      websiteUrl,
      ceoName,
      officeContactNumber
    } = profileData;

    const requiredFields = {
      establishmentYear,
      licenseExpiryDate,
      headquartersAddress,
      countryOfOperation,
      typeOfOperation,
      websiteUrl,
      ceoName,
      officeContactNumber
    };

    const missingFields = Object.keys(requiredFields).filter(
      field => !requiredFields[field as keyof typeof requiredFields]
    );

    if (missingFields.length > 0) {
      throw new validationError(
        `Missing required fields: ${missingFields.join(', ')}`
      );
    }


    if (isNaN(Number(establishmentYear))) {
      throw new validationError("establishmentYear must be a number");
    }

    if (isNaN(new Date(licenseExpiryDate).getTime())) {
      throw new validationError("licenseExpiryDate must be a valid date");
    }

    if (websiteUrl && !this.isValidUrl(websiteUrl)) {
      throw new validationError("websiteUrl must be a valid URL");
    }

    // Upload new files to Cloudinary or keep existing URLs
    let logoUrl = provider.logoUrl;
    let registrationCertificateUrl = provider.registrationCertificateUrl;
    let insuranceProofUrl = provider.insuranceProofUrl;

    if (logoUrl) {
      logoUrl = await this.uploadToCloud(
        logoUrl,
        `skylife/providers/${providerId}/logo`
      );
    }

    if (registration_certificateUrl) {
      registrationCertificateUrl = await this.uploadToCloud(
        registration_certificateUrl,
        `skylife/providers/${providerId}/documents`
      );
    }

    if (insuranceProofUrl) {
      insuranceProofUrl = await this.uploadToCloud(
        insuranceProofUrl,
        `skylife/providers/${providerId}/documents`
      );
    }

    // Build update data
    const updateData: Partial<UpdateProviderDTO> = {
      establishmentYear: Number(establishmentYear),
      licenseExpiryDate: new Date(licenseExpiryDate),
      headquartersAddress,
      countryOfOperation,
      typeOfOperation,
      websiteUrl,
      ceoName,
      officeContactNumber
    };


    if (logoUrl) updateData.logoUrl = logoUrl;
    if (registrationCertificateUrl) updateData.registrationCertificateUrl = registrationCertificateUrl;
    if (insuranceProofUrl) updateData.insuranceProofUrl = insuranceProofUrl;


    if (companyName) updateData.companyName = companyName;
    if (email) updateData.email = email;
    if (mobile) updateData.mobile = mobile;
    if (airlineCode) updateData.airlineCode = airlineCode;

    // Update profile in database
    await this._providerRepository.completeProviderProfile(providerId, updateData as UpdateProviderDTO);
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  }
}
