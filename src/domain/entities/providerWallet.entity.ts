import mongoose, { Document } from "mongoose";

export interface IProviderWallet extends Document {
  _id: string;
  providerId: string;
  balance: number;
  currency: string;
  lastTransactionDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
