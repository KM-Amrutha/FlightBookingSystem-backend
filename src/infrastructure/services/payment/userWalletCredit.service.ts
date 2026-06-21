import { inject, injectable } from "inversify";
import crypto from "crypto";
import { IUserWalletRepository } from "@domain/interfaces/IUserWalletRepository";
import {
  IWallet,
  IWalletTransaction,
} from "@domain/entities/userWallet.entity";
import { IUserWalletCreditService } from "@di/file-imports-index";
import { TYPES_BOOKING_REPOSITORIES } from "@di/types-repositories";
import { WALLET_MESSAGES } from "@shared/constants/walletMessages/wallet.messages";

@injectable()
export class UserWalletCreditService
  implements IUserWalletCreditService
{
  constructor(
    @inject(TYPES_BOOKING_REPOSITORIES.UserWalletRepository)
    private readonly _walletRepository: IUserWalletRepository
  ) {}

  async creditRefund(
    userId: string,
    bookingId: string,
    passengerId: string,
    refundAmount: number
  ): Promise<IWallet> {
    let wallet = await this._walletRepository.getWalletByUserId(userId);

    if (!wallet) {
      wallet = await this._walletRepository.createWallet(userId);
    }

    const transaction: IWalletTransaction = {
      transactionId: crypto.randomUUID(),
      type: "credit",
      amount: refundAmount,
      description: WALLET_MESSAGES.PASSENGER_REFUND,
      bookingId,
      passengerId,
      createdAt: new Date(),
    };

    return await this._walletRepository.creditWallet(
      userId,
      transaction,
      refundAmount
    );
  }
}