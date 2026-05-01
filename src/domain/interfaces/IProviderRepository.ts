import { IProvider } from "@domain/entities/provider.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";

export interface IProviderRepository extends IBaseRepository<IProvider> {
  getProviderDetailsById(providerId: string): Promise<IProvider | null>;
  getProviderByEmail(email: string): Promise<IProvider | null>;
  getProviderByEmailWithPassword(email: string): Promise<IProvider | null>;
  getProviderByAirlineCode(airlineCode: string): Promise<IProvider | null>;
  getActiveProviders(): Promise<IProvider[]>;
  getVerifiedProviders(): Promise<IProvider[]>;
  isProviderBlocked(providerId: string): Promise<boolean>;
  createProvider(providerData: Partial<IProvider>): Promise<IProvider>;
  updateProvider(providerId: string, updateData: Partial<IProvider>): Promise<IProvider | null>;
  updateActiveStatus(providerId: string, isActive: boolean): Promise<boolean>;
  updateVerificationStatus(providerId: string, isVerified: boolean): Promise<boolean>;
  completeProviderProfile(providerId: string, profileData: Partial<IProvider>): Promise<void>;
  approveProvider(providerId: string): Promise<void>;
  rejectProvider(providerId: string, reason: string): Promise<void>;
  getAllProviders(
    page: number,
    limit: number,
    search?: string,
    filters?: string[]
  ): Promise<{
    providers: IProvider[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
  }>;
  countDocs(role: string): Promise<number>;
}