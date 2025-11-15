import { IAdminActionLog } from "@domain/entities/adminActionLog.entity";
import mongoose, { Schema } from "mongoose";

const adminActionLogSchema: Schema = new Schema(
  {
    adminId: {
      type: String,
      required: true,
      ref: "User"
    },
    actionType: {
      type: String,
      required: true,
      enum: ["create", "update", "delete", "approve", "reject", "suspend"]
    },
    targetType: {
      type: String,
      required: true,
      enum: ["user", "provider", "booking", "flight", "payment"]
    },
    targetId: {
      type: String,
      required: true
    },
    changes: {
      type: String,
      required: true
    },
    actionTime: {
      type: Date,
      required: true,
      default: Date.now
    }
  },
  { timestamps: true }
);

adminActionLogSchema.index({ adminId: 1 });
adminActionLogSchema.index({ actionType: 1 });
adminActionLogSchema.index({ targetType: 1, targetId: 1 });
adminActionLogSchema.index({ actionTime: -1 });

const AdminActionLogModel = mongoose.model<IAdminActionLog>(
  "AdminActionLog",
  adminActionLogSchema
);
export default AdminActionLogModel;
