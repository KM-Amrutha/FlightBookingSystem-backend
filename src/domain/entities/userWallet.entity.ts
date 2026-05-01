export interface IUserWallet {
  _id: string;
  userId: string;
  balance: number;
  currency: string;
  lastTransactionDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
