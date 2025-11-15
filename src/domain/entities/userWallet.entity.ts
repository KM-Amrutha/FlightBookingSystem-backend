import mongoose, { Document } from "mongoose";

export interface IUserWallet extends Document {
  _id: string;
  userId: string;
  balance: number;
  currency: string;
  lastTransactionDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
