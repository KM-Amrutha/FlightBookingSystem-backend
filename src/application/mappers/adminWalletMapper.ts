import { IAdminWallet, IAdminWalletTransaction } from "@domain/entities/adminWallet.entity";
import {
  AdminWalletResponseDTO,
  AdminWalletTransactionResponseDTO,
} from "@application/dtos/wallet-dtos";

export class AdminWalletMapper {
  private static toTransactionResponseDTO(
    tx: IAdminWalletTransaction
  ): AdminWalletTransactionResponseDTO {
    return {
      transactionId: tx.transactionId,
      type: tx.type,
      amount: tx.amount,
      description: tx.description,
      commissionRate: tx.commissionRate,
      ...(tx.bookingId && { bookingId: tx.bookingId }),
      ...(tx.providerId && { providerId: tx.providerId }),
      createdAt: tx.createdAt.toISOString(),
    };
  }

  static toAdminWalletResponseDTO(wallet: IAdminWallet): AdminWalletResponseDTO {
    return {
      id: wallet.id,
      balance: wallet.balance,
      transactions: wallet.transactions
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .map((tx) => AdminWalletMapper.toTransactionResponseDTO(tx)),
      createdAt: wallet.createdAt.toISOString(),
      updatedAt: wallet.updatedAt.toISOString(),
    };
  }
}