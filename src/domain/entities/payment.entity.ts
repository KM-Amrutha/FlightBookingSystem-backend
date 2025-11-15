import mongoose, { Document } from "mongoose";

export interface IPayment extends Document {
  _id: string;
  segmentId: string;
  amount: number;
  paymentMethod: string;
  status: string;
  transactionId: string;
  paymentDate: Date;
  providerId: string;
  createdAt: Date;
  updatedAt: Date;
}
