import {
  IProviderWallet,
  IProviderWalletTransaction,
} from "@domain/entities/providerWallet.entity";
import {
  ProviderWalletResponseDTO,
  ProviderWalletTransactionResponseDTO,
} from "@application/dtos/wallet-dtos";

export class ProviderWalletMapper {
  private static toTransactionResponseDTO(
    tx: IProviderWalletTransaction
  ): ProviderWalletTransactionResponseDTO {
    return {
      transactionId: tx.transactionId,
      type: tx.type,
      amount: tx.amount,
      description: tx.description,
      ...(tx.bookingId && { bookingId: tx.bookingId }),
      ...(tx.flightId && { flightId: tx.flightId }),
      createdAt: tx.createdAt.toISOString(),
    };
  }

  static toProviderWalletResponseDTO(
    wallet: IProviderWallet
  ): ProviderWalletResponseDTO {
    return {
      id: wallet.id,
      providerId: wallet.providerId,
      balance: wallet.balance,
      transactions: wallet.transactions
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .map((tx) => ProviderWalletMapper.toTransactionResponseDTO(tx)),
      createdAt: wallet.createdAt.toISOString(),
      updatedAt: wallet.updatedAt.toISOString(),
    };
  }
}