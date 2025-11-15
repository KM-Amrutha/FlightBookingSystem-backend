import mongoose, { Document } from "mongoose";

export interface IAdminActionLog extends Document {
  _id: string;
  adminId: string;
  actionType: string;
  targetType: string;
  targetId: string;
  changes: string;
  actionTime: Date;
  createdAt: Date;
}
