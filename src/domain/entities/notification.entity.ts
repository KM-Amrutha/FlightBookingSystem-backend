import mongoose, { Document } from "mongoose";

export interface INotification extends Document {
  _id: string;
  userId: string;
  providerId: string;
  segmentId: string;
  bookingDetailId: string;
  notificationType: string;
  subject: string;
  message: string;
  status: string;
  isSent: boolean;
  sentAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
