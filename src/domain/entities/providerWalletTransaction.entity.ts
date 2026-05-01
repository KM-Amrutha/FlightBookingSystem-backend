export interface IProviderWalletTransaction {
  _id: string;
  walletId: string;
  paymentId: string;
  amount: number;
  transactionType: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
