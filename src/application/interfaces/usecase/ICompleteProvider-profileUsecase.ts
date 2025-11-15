import { UpdateProviderDTO } from "@application/dtos/provider-dtos";

export interface ICompleteProviderProfileUseCase {
  execute(providerId: string, profileData: UpdateProviderDTO): Promise<void>;
}