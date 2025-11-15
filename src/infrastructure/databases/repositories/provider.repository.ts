import { Model } from "mongoose";
import { IProviderRepository } from "@domain/interfaces/IProviderRepository";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { IProvider } from "@domain/entities/provider.entity";
import { Provider, CreateProviderDTO, UpdateProviderDTO } from "@application/dtos/provider-dtos";
import ProviderModel from "../models/provider.model";

export class ProviderRepository
  extends BaseRepository<IProvider>
  implements IProviderRepository
{
  constructor(model: Model<IProvider> = ProviderModel) {
    super(model);
  }

  async completeProviderProfile(
    providerId: string, 
    profileData: UpdateProviderDTO
  ): Promise<void> {
    await this.model.findByIdAndUpdate(
      providerId,
      {
        ...profileData,
        isProfileComplete: true
      },
      { new: true }
    ).exec();
  }

  async getProviderDetailsById(providerId: string): Promise<Provider> {
    const providerData = await this.model.aggregate([
      {
        $match: {
          _id: this.parseId(providerId),
        },
      },
      {
        $project: {
          _id: 1,
          companyName: 1,
          email: 1,
          mobile: 1,
          airlineCode: 1,
          logoUrl: 1,
          registrationCertificateUrl: 1,
          insuranceProofUrl: 1,
          establishmentYear: 1,
          licenseExpiryDate: 1,
          headquartersAddress: 1,
          countryOfOperation: 1,
          typeOfOperation: 1,
          websiteUrl: 1,
          ceoName: 1,
          officeContactNumber: 1,
          createdAt: 1,
          updatedAt: 1,
          isActive: 1,
          isVerified: 1,
          isProfileComplete: 1
        },
      },
    ]);
    return providerData[0];
  }

  async getProviderByEmail(email: string): Promise<Provider | null> {
    const providerData = await this.model.aggregate([
      {
        $match: {
          email: email,
        },
      },
      {
        $project: {
          _id: 1,
          companyName: 1,
          email: 1,
          mobile: 1,
          password: 1,
          airlineCode: 1,
          logoUrl: 1,
          registrationCertificateUrl: 1,
          insuranceProofUrl: 1,
          establishmentYear: 1,
          licenseExpiryDate: 1,
          headquartersAddress: 1,
          countryOfOperation: 1,
          typeOfOperation: 1,
          websiteUrl: 1,
          ceoName: 1,
          officeContactNumber: 1,
          createdAt: 1,
          updatedAt: 1,
          isActive: 1,
          isVerified: 1,
          isProfileComplete: 1
        },
      },
    ]);
    return providerData.length > 0 ? providerData[0] : null;
  }

  async getProviderByAirlineCode(airlineCode: string): Promise<Provider | null> {
    const providerData = await this.model.aggregate([
      {
        $match: {
          airlineCode: airlineCode,
        },
      },
      {
        $project: {
          _id: 1,
          companyName: 1,
          email: 1,
          mobile: 1,
          airlinCode: 1,
          logoUrl: 1,
          registrationCertificateUrl: 1,
          insuranceProofUrl: 1,
          establishmentYear: 1,
          licenseExpiryDate: 1,
          headquartersAddress: 1,
          countryOfOperation: 1,
          typeOfOperation: 1,
          websiteUrl: 1,
          ceoName: 1,
          officeContactNumber: 1,
          createdAt: 1,
          updatedAt: 1,
          isActive: 1,
          isVerified: 1,
          isProfileComplete: 1
        },
      },
    ]);
    return providerData.length > 0 ? providerData[0] : null;
  }

  async getActiveProviders(): Promise<Provider[]> {
    const providersData = await this.model.aggregate([
      {
        $match: {
          isActive: true,
        },
      },
      {
        $project: {
          _id: 1,
          companyName: 1,
          email: 1,
          mobile: 1,
          airlineCode: 1,
          logoUrl: 1,
          establishmentYear: 1,
          headquartersAddress: 1,
          countryOfOperation: 1,
          typeOfOperation: 1,
          websiteUrl: 1,
          createdAt: 1,
          updatedAt: 1,
          isActive: 1,
          isVerified: 1,
          isProfileComplete: 1
        },
      },
    ]).sort({ createdAt: -1 });
    return providersData;
  }

  async getVerifiedProviders(): Promise<Provider[]> {
    const providersData = await this.model.aggregate([
      {
        $match: {
          isVerified: true,
          isActive: true,
        },
      },
      {
        $project: {
          _id: 1,
          companyName: 1,
          email: 1,
          mobile: 1,
          airlineCode: 1,
          logoUrl: 1,
          establishmentYear: 1,
          headquartersAddress: 1,
          countryOfOperation: 1,
          typeOfOperation: 1,
          websiteUrl: 1,
          createdAt: 1,
          updatedAt: 1,
          isActive: 1,
          isVerified: 1,
          isProfileComplete: 1
        },
      },
    ]).sort({ createdAt: -1 });
    return providersData;
  }

  async isProviderBlocked(providerId: string): Promise<boolean> {
    const provider = await this.model.findById(providerId).select('isActive').exec();
    return !provider?.isActive || false;
  }

  async createProvider(providerData: CreateProviderDTO): Promise<Provider> {
    const newProvider = new this.model(providerData);
    const savedProvider = await newProvider.save();
    return this.getProviderDetailsById(savedProvider._id);
  }

  async updateProvider(providerId: string, updateData: UpdateProviderDTO): Promise<Provider | null> {
    const updatedProvider = await this.model.findByIdAndUpdate(
      providerId,
      updateData,
      { new: true }
    ).exec();
    
    if (!updatedProvider) return null;
    return this.getProviderDetailsById(updatedProvider._id);
  }

  async updateActiveStatus(providerId: string, isActive: boolean): Promise<boolean> {
    const result = await this.model.findByIdAndUpdate(
      providerId,
      { isActive: isActive },
      { new: true }
    ).exec();
    return result !== null;
  }

  async updateVerificationStatus(providerId: string, isVerified: boolean): Promise<boolean> {
    const result = await this.model.findByIdAndUpdate(
      providerId,
      { isVerified: isVerified },
      { new: true }
    ).exec();
    return result !== null;
  }

  async getProviderByEmailWithPassword(email: string): Promise<IProvider | null> {
  return await ProviderModel.findOne({ email });
}
}
