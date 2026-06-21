export interface IProviderWalletTransaction {
  transactionId: string;
  type: "credit";
  amount: number;
  description: string;
  bookingId?: string;
  flightId?: string;
  createdAt: Date;
}

export interface IProviderWallet {
  id: string;
  providerId: string;
  balance: number;
  transactions: IProviderWalletTransaction[];
  createdAt: Date;
  updatedAt: Date;
}