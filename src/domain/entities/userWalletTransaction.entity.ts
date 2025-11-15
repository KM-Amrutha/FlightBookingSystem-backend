import mongoose, { Document } from "mongoose";

export interface IUserWalletTransaction extends Document {
  _id: string;
  walletId: string;
  paymentId: string;
  amount: number;
  transactionType: "credit" | "debit" | "refund";
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
