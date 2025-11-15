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
          logo_url: 1,
          registration_certificate_url: 1,
          insurance_proof_url: 1,
          establishment_year: 1,
          license_expiry_date: 1,
          headquarters_address: 1,
          country_of_operation: 1,
          type_of_operation: 1,
          website_url: 1,
          ceo_name: 1,
          office_contact_number: 1,
          created_at: 1,
          updated_at: 1,
          isActive: 1,
          isVerified: 1,
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
          logo_url: 1,
          registration_certificate_url: 1,
          insurance_proof_url: 1,
          establishment_year: 1,
          license_expiry_date: 1,
          headquarters_address: 1,
          country_of_operation: 1,
          type_of_operation: 1,
          website_url: 1,
          ceo_name: 1,
          office_contact_number: 1,
          created_at: 1,
          updated_at: 1,
          isActive: 1,
          isVerified: 1,
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
          logo_url: 1,
          registration_certificate_url: 1,
          insurance_proof_url: 1,
          establishment_year: 1,
          license_expiry_date: 1,
          headquarters_address: 1,
          country_of_operation: 1,
          type_of_operation: 1,
          website_url: 1,
          ceo_name: 1,
          office_contact_number: 1,
          created_at: 1,
          updated_at: 1,
          isActive: 1,
          isVerified: 1,
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
          logo_url: 1,
          establishment_year: 1,
          headquarters_address: 1,
          country_of_operation: 1,
          type_of_operation: 1,
          website_url: 1,
          created_at: 1,
          updated_at: 1,
          isActive: 1,
          isVerified: 1,
        },
      },
    ]).sort({ created_at: -1 });
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
          logo_url: 1,
          establishment_year: 1,
          headquarters_address: 1,
          country_of_operation: 1,
          type_of_operation: 1,
          website_url: 1,
          created_at: 1,
          updated_at: 1,
          isActive: 1,
          isVerified: 1,
        },
      },
    ]).sort({ created_at: -1 });
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
