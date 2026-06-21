export interface IWalletTransaction {
  transactionId: string;
  type: "credit";
  amount: number;
  description: string;
  bookingId?: string;
  passengerId?: string;
  createdAt: Date;
}

export interface IWallet {
  id: string;
  userId: string;
  balance: number;
  transactions: IWalletTransaction[];
  createdAt: Date;
  updatedAt: Date;
}