import { IProviderRepository } from "@domain/interfaces/IProviderRepository";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { IProvider } from "@domain/entities/provider.entity";
import { paginateReq, paginateRes } from "@shared/utils/pagination";
import ProviderModel from "@infrastructure/databases/models/provider.model";

export class ProviderRepository
  extends BaseRepository<IProvider>
  implements IProviderRepository
{
  constructor() {
    super(ProviderModel);
  }

  async getProviderDetailsById(providerId: string): Promise<IProvider | null> {
    const providerData = await ProviderModel.aggregate([
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
          role: 1,
           adminApproval: 1,
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
          isProfileComplete: 1,
          profileStatus: 1,
          rejectionReason: 1,
          rejectionDate: 1,
        },
      },
    ]);

    if (!providerData[0]) return null;

    return {
      ...providerData[0],
      id: providerData[0]._id.toString(),
    };
  }

  async getProviderByEmail(email: string): Promise<IProvider | null> {
    const providerData = await ProviderModel.aggregate([
      { $match: { email } },
      {
        $project: {
          _id: 1,
          companyName: 1,
          email: 1,
          mobile: 1,
          airlineCode: 1,
          role: 1,
           adminApproval: 1,
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
          isProfileComplete: 1,
          profileStatus: 1,
          rejectionReason: 1,
          rejectionDate: 1,
        },
      },
    ]);

    if (!providerData[0]) return null;

    return {
      ...providerData[0],
      id: providerData[0]._id.toString(),
    };
  }

  async getProviderByEmailWithPassword(email: string): Promise<IProvider | null> {
  const doc = await ProviderModel.findOne({ email }).lean().exec();
  if (!doc) return null;

  const { _id, __v, ...rest } = doc as typeof doc & {
    _id: { toString(): string };
    __v?: number;
  };

  return {
    ...(rest as Omit<IProvider, "id">),
    id: _id.toString(),
  };
}

  async getProviderByAirlineCode(airlineCode: string): Promise<IProvider | null> {
    const providerData = await ProviderModel.aggregate([
      { $match: { airlineCode } },
      {
        $project: {
          _id: 1,
          companyName: 1,
          email: 1,
          mobile: 1,
          airlineCode: 1,
          role: 1,
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
          isProfileComplete: 1,
          profileStatus: 1,
          rejectionReason: 1,
          rejectionDate: 1,
        },
      },
    ]);

    if (!providerData[0]) return null;

    return {
      ...providerData[0],
      id: providerData[0]._id.toString(),
    };
  }

  async getActiveProviders(): Promise<IProvider[]> {
    const providersData = await ProviderModel.aggregate([
      { $match: { isActive: true } },
      {
        $project: {
          _id: 1,
          companyName: 1,
          email: 1,
          mobile: 1,
          airlineCode: 1,
          role: 1,
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
          isProfileComplete: 1,
          profileStatus: 1,
          rejectionReason: 1,
          rejectionDate: 1,
        },
      },
    ]).sort({ createdAt: -1 });

    return providersData.map((provider) => ({
      ...provider,
      id: provider._id.toString(),
    }));
  }

  async getVerifiedProviders(): Promise<IProvider[]> {
    const providersData = await ProviderModel.aggregate([
      { $match: { isVerified: true, isActive: true } },
      {
        $project: {
          _id: 1,
          companyName: 1,
          email: 1,
          mobile: 1,
          airlineCode: 1,
          role: 1,
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
          isProfileComplete: 1,
          profileStatus: 1,
          rejectionReason: 1,
          rejectionDate: 1,
        },
      },
    ]).sort({ createdAt: -1 });

    return providersData.map((provider) => ({
      ...provider,
      id: provider._id.toString(),
    }));
  }

  async isProviderBlocked(providerId: string): Promise<boolean> {
    const provider = await ProviderModel.findById(providerId)
      .select("isActive")
      .exec();
    return !provider?.isActive || false;
  }

  async createProvider(providerData: Partial<IProvider>): Promise<IProvider> {
    const newProvider = new ProviderModel({
      ...providerData,
      profileStatus: "pending",
    });
    const savedProvider = await newProvider.save();
    const provider = await this.getProviderDetailsById(
      savedProvider._id.toString()
    );
    return provider!;
  }

  async updateProvider(
    providerId: string,
    updateData: Partial<IProvider>
  ): Promise<IProvider | null> {
    const updatedProvider = await ProviderModel.findByIdAndUpdate(
      providerId,
      updateData,
      { new: true }
    ).exec();

    if (!updatedProvider) return null;

    return this.getProviderDetailsById(updatedProvider._id.toString());
  }

  async updateActiveStatus(
    providerId: string,
    isActive: boolean
  ): Promise<boolean> {
    const result = await ProviderModel.findByIdAndUpdate(
      providerId,
      { isActive: isActive },
      { new: true }
    ).exec();
    return result !== null;
  }

  async updateVerificationStatus(
    providerId: string,
    isVerified: boolean
  ): Promise<boolean> {
    const result = await ProviderModel.findByIdAndUpdate(
      providerId,
      { isVerified: isVerified },
      { new: true }
    ).exec();
    return result !== null;
  }

  async completeProviderProfile(
    providerId: string,
    profileData: Partial<IProvider>
  ): Promise<void> {
    await ProviderModel.findByIdAndUpdate(
      providerId,
      {
        ...profileData,
        isProfileComplete: true,
        profileStatus: "pending",
      },
      { new: true }
    ).exec();
  }

  async approveProvider(providerId: string): Promise<void> {
    await ProviderModel.findByIdAndUpdate(
      providerId,
      {
        profileStatus: "approved",
        rejectionReason: null,
        rejectionDate: null,
      },
      { new: true }
    ).exec();
  }

  async rejectProvider(providerId: string, reason: string): Promise<void> {
    if (!reason || reason.trim().length < 10) {
      throw new Error("Reason must be at least 10 characters");
    }

    await ProviderModel.findByIdAndUpdate(
      providerId,
      {
        profileStatus: "rejected",
        rejectionReason: reason.trim(),
        rejectionDate: new Date(),
      },
      { new: true }
    ).exec();
  }

async getAllProviders(page:number, limit:number, search?:string, filters?:string[]):
  Promise<{
    providers: IProvider[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }> {
    const { pageNumber, limitNumber, skip } = paginateReq(page, limit);
    const matchquery: Record<string, unknown> = { role: "provider" };
   

  if (search) {
      matchquery.$or = [
        { companyName: { $regex: search, $options: "i" } },
        { airlineCode: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    
if (filters && filters.length > 0 && !filters.includes("All")) {

      const conditions: Record<string, unknown>[] = [];
     if(filters.includes("Active")){
       conditions.push({ isActive: true });
     }  
      if(filters.includes("Inactive")){ 
        conditions.push({ isActive: false });   
      }
      if (filters.includes("verified"))
        conditions.push({ isVerified: true });
      if (filters.includes("Not verified"))
        conditions.push({ isVerified: false });

      if (conditions.length > 0) matchquery.$and = conditions;
  }



   const totalCount = await ProviderModel.countDocuments({
      role: "provider",
      ...matchquery,
    });
    const providerData = await ProviderModel
      .find({ role: "provider", ...matchquery })
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 })
      .lean();

      const provider: IProvider[] = providerData.map((provider) => {
      const { _id, __v, ...rest } = provider as typeof provider & {
        _id: { toString(): string };
        __v?: number;
      };
      return {
        ...(rest as Omit<IProvider, "id">),
        id: _id.toString(),
      };
    });

    const paginationData = paginateRes({
      totalCount,
      pageNumber,
      limitNumber,
    });
    return {
       providers:provider,
       totalCount,
       currentPage: paginationData.currentPage,
      totalPages: paginationData.totalPages,
      
    }
}

  async countDocs(role: string): Promise<number> {
    return await ProviderModel.countDocuments({ role: role });
  }
}