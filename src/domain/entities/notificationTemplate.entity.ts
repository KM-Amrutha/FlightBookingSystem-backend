import mongoose, { Document } from "mongoose";

export interface INotificationTemplate extends Document {
  _id: string;
  providerId: string;
  notificationType: string;
  subject: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  createdByProvider: string;
}
