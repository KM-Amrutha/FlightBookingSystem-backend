import { IProvider } from "@domain/entities/provider.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";
import { Provider,
     CreateProviderDTO,
      UpdateProviderDTO } from "@application/dtos/provider-dtos";

      export interface IProviderRepository extends IBaseRepository<IProvider>{
      
  getProviderDetailsById(providerId: string): Promise<Provider>;
  getProviderByEmail(email: string): Promise<Provider | null>;
  getProviderByAirlineCode(airlineCode: string): Promise<Provider | null>;
  getActiveProviders(): Promise<Provider[]>;
  getVerifiedProviders(): Promise<Provider[]>;
  isProviderBlocked(providerId: string): Promise<boolean>;
  createProvider(providerData: CreateProviderDTO): Promise<Provider>;
  updateProvider(providerId: string, updateData: UpdateProviderDTO): Promise<Provider | null>;
  updateActiveStatus(providerId: string, isActive: boolean): Promise<boolean>;
  updateVerificationStatus(providerId: string, isVerified: boolean): Promise<boolean>;
 completeProviderProfile(providerId: string, profileData: UpdateProviderDTO): Promise<void>;

  getProviderByEmailWithPassword(email: string): Promise<IProvider | null>;
      }