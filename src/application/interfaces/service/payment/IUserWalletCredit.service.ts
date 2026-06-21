import { IWallet } from "@domain/entities/userWallet.entity";

export interface IUserWalletCreditService {
  creditRefund(
    userId: string,
    bookingId: string,
    passengerId: string,
    refundAmount: number
  ): Promise<IWallet>;
}