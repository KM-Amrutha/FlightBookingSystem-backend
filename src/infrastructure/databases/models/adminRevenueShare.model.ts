import { IAdminRevenueShare } from "@domain/entities/adminRevenueShare.entity";
import mongoose, { Schema } from "mongoose";

const adminRevenueShareSchema: Schema = new Schema(
  {
    adminId: {
      type: String,
      required: true,
      ref: "User"
    },
    bookingDetailId: {
      type: String,
      required: true,
      ref: "BookingDetail"
    },
    paymentId: {
      type: String,
      required: true,
      ref: "Payment"
    },
    shareAmount: {
      type: Number,
      required: true,
      min: 0
    },
    payoutDate: {
      type: Date
    },
    createdBy: {
      type: String,
      required: true,
      ref: "User"
    }
  },
  { timestamps: true }
);

adminRevenueShareSchema.index({ adminId: 1 });
adminRevenueShareSchema.index({ bookingDetailId: 1 });
adminRevenueShareSchema.index({ paymentId: 1 });
adminRevenueShareSchema.index({ payoutDate: 1 });

const AdminRevenueShareModel = mongoose.model<IAdminRevenueShare>(
  "AdminRevenueShare",
  adminRevenueShareSchema
);
export default AdminRevenueShareModel;
