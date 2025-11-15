import { IProviderWalletTransaction } from "@domain/entities/providerWalletTransaction.entity";
import mongoose, { Schema } from "mongoose";

const providerWalletTransactionSchema: Schema = new Schema(
  {
    walletId: {
      type: String,
      required: true,
      ref: "ProviderWallet"
    },
    paymentId: {
      type: String,
      required: true,
      ref: "Payment"
    },
    amount: {
      type: Number,
      required: true
    },
    transactionType: {
      type: String,
      required: true,
      enum: ["credit", "debit", "refund", "commission"]
    },
    description: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

providerWalletTransactionSchema.index({ walletId: 1 });
providerWalletTransactionSchema.index({ paymentId: 1 });
providerWalletTransactionSchema.index({ createdAt: -1 });

const ProviderWalletTransactionModel = mongoose.model<IProviderWalletTransaction>(
  "ProviderWalletTransaction",
  providerWalletTransactionSchema
);
export default ProviderWalletTransactionModel;
