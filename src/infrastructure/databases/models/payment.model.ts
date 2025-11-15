import { IPayment } from "@domain/entities/payment.entity";
import mongoose, { Schema } from "mongoose";

const paymentSchema: Schema = new Schema(
  {
    segmentId: {
      type: String,
      required: true,
      ref: "BookingSegment"
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["credit_card", "debit_card", "upi", "wallet", "net_banking"]
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending"
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    paymentDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    providerId: {
      type: String,
      required: true,
      ref: "Provider"
    }
  },
  { timestamps: true }
);

paymentSchema.index({ segmentId: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ providerId: 1 });
paymentSchema.index({ paymentDate: -1 });

const PaymentModel = mongoose.model<IPayment>("Payment", paymentSchema);
export default PaymentModel;
