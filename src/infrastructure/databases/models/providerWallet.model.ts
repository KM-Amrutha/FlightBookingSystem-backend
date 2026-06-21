import mongoose, { Schema } from "mongoose";

const providerWalletTransactionSchema = new Schema(
  {
    transactionId: { type: String, required: true },
    type: { type: String, enum: ["credit"], required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    bookingId: { type: String, default: null },
    flightId: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const providerWalletSchema: Schema = new Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
      unique: true,
    },
    balance: { type: Number, required: true, default: 0 },
    transactions: { type: [providerWalletTransactionSchema], default: [] },
  },
  { timestamps: true }
);
const ProviderWalletModel = mongoose.model("ProviderWallet", providerWalletSchema);
export default ProviderWalletModel;