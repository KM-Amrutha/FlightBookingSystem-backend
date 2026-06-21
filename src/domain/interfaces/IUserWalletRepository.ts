import {
  IWallet,
  IWalletTransaction,
} from "@domain/entities/userWallet.entity";

export interface IUserWalletRepository {
  getWalletByUserId(userId: string): Promise<IWallet | null>;

  createWallet(userId: string): Promise<IWallet>;

  creditWallet(
    userId: string,
    transaction: IWalletTransaction,
    amount: number
  ): Promise<IWallet>;
}