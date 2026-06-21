import { IWallet, IWalletTransaction } from "@domain/entities/userWallet.entity";
import {
  UserWalletResponseDTO,
  UserWalletTransactionResponseDTO,
} from "@application/dtos/wallet-dtos";

export class UserWalletMapper {
  private static toTransactionResponseDTO(
    tx: IWalletTransaction
  ): UserWalletTransactionResponseDTO {
    return {
      transactionId: tx.transactionId,
      type: tx.type,
      amount: tx.amount,
      description: tx.description,
      ...(tx.bookingId && { bookingId: tx.bookingId }),
      ...(tx.passengerId && { passengerId: tx.passengerId }),
      createdAt: tx.createdAt.toISOString(),
    };
  }

  static toWalletResponseDTO(wallet: IWallet): UserWalletResponseDTO {
    return {
      id: wallet.id,
      userId: wallet.userId,
      balance: wallet.balance,
      transactions: wallet.transactions
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .map((tx) => UserWalletMapper.toTransactionResponseDTO(tx)),
      createdAt: wallet.createdAt.toISOString(),
      updatedAt: wallet.updatedAt.toISOString(),
    };
  }
}