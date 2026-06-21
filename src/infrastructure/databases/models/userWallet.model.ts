import mongoose, { Schema } from "mongoose";

const walletTransactionSchema = new Schema(
  {
    transactionId: { type: String, required: true },
    type: { type: String, enum: ["credit"], required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    bookingId: { type: String, default: null },
    passengerId: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const walletSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    balance: { type: Number, required: true, default: 0 },
    transactions: { type: [walletTransactionSchema], default: [] },
  },
  { timestamps: true }
);

const WalletModel = mongoose.model("Wallet", walletSchema);
export default WalletModel;