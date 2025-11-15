// providerWallet.model.ts
import { IProviderWallet } from "@domain/entities/providerWallet.entity";
import mongoose, { Schema } from "mongoose";

const providerWalletSchema: Schema = new Schema(
  {
    providerId: {
      type: String,
      required: true,
      unique: true,
      ref: "Provider"
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
      uppercase: true
    },
    lastTransactionDate: {
      type: Date
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

providerWalletSchema.index({ providerId: 1 });
providerWalletSchema.index({ isActive: 1 });

const ProviderWalletModel = mongoose.model<IProviderWallet>(
  "ProviderWallet",
  providerWalletSchema
);
export default ProviderWalletModel;
