import mongoose, { Document } from "mongoose";

export interface IProviderWalletTransaction extends Document {
  _id: string;
  walletId: string;
  paymentId: string;
  amount: number;
  transactionType: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
