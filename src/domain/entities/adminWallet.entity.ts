export interface IAdminWallet {
  id: string;
  balance: number;
  transactions: IAdminWalletTransaction[];
  createdAt: Date;
  updatedAt: Date;
}
export interface IAdminWalletTransaction {
  transactionId: string;
  type: "credit";
  amount: number;
  description: string;
  bookingId?: string;
  providerId?: string;
  commissionRate: number;
  createdAt: Date;
}

