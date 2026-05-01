import { Provider } from "@application/dtos/provider-dtos";

export interface IGetProviderProfileUseCase {
  execute(providerId: string): Promise<Provider>;
}