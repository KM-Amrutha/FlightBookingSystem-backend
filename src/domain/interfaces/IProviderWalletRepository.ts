import {
  IProviderWallet,
  IProviderWalletTransaction,
} from "@domain/entities/providerWallet.entity";

export interface IProviderWalletRepository {
  getWalletByProviderId(
    providerId: string
  ): Promise<IProviderWallet | null>;

  createWallet(providerId: string): Promise<IProviderWallet>;

  creditWallet(
    providerId: string,
    transaction: IProviderWalletTransaction,
    amount: number
  ): Promise<IProviderWallet>;
}