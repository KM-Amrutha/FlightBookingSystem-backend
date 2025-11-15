import { IOffer } from "@domain/entities/offer.entity";
import mongoose, { Schema } from "mongoose";

const offerSchema: Schema = new Schema(
  {
    offerCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    discountAmount: {
      type: Number,
      required: true,
      min: 0
    },
    validFrom: {
      type: Date,
      required: true
    },
    validTo: {
      type: Date,
      required: true
    },
    createdByProvider: {
      type: String,
      required: true,
      ref: "Provider"
    },
    aircraftId: {
      type: String,
      required: true,
      ref: "Aircraft"
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true
    }
  },
  { timestamps: true }
);

offerSchema.index({ offerCode: 1 });
offerSchema.index({ isActive: 1, validFrom: 1, validTo: 1 });
offerSchema.index({ createdByProvider: 1 });

const OfferModel = mongoose.model<IOffer>("Offer", offerSchema);
export default OfferModel;
