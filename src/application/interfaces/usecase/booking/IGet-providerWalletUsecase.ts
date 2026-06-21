import { ProviderWalletResponseDTO } from "@application/dtos/wallet-dtos";

export interface IGetProviderWalletUseCase {
  execute(providerId: string): Promise<ProviderWalletResponseDTO>;
}