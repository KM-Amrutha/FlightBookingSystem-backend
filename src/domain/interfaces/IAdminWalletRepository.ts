import {
  IAdminWallet,
  IAdminWalletTransaction,
} from "@domain/entities/adminWallet.entity";

export interface IAdminWalletRepository {
  getAdminWallet(): Promise<IAdminWallet | null>;

  creditWallet(
    transaction: IAdminWalletTransaction,
    amount: number
  ): Promise<IAdminWallet>;
}