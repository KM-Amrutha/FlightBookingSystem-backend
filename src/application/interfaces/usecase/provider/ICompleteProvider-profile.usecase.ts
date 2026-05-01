import { IProvider } from "@domain/entities/provider.entity";

export interface ICompleteProviderProfileUseCase {
  execute(providerId: string, profileData: Partial<IProvider>): Promise<void>;
}