import mongoose, { Schema } from "mongoose";

const adminWalletTransactionSchema = new Schema(
  {
    transactionId: { type: String, required: true },
    type: { type: String, enum: ["credit"], required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    bookingId: { type: String, default: null },
    providerId: { type: String, default: null },
    commissionRate: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const adminWalletSchema: Schema = new Schema(
  {
    balance: { type: Number, required: true, default: 0 },
    transactions: { type: [adminWalletTransactionSchema], default: [] },
  },
  { timestamps: true }
);

const AdminWalletModel = mongoose.model("AdminWallet", adminWalletSchema);
export default AdminWalletModel;