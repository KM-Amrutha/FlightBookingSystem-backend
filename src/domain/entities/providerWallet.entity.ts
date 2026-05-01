export interface IProviderWallet {
  _id: string;
  providerId: string;
  balance: number;
  currency: string;
  lastTransactionDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
