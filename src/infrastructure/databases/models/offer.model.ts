import mongoose, { Schema } from "mongoose";

const offerSchema: Schema = new Schema(
  {
    aircraftId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Aircraft",
      required: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },
    offerCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
    minimumAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validTo: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    usageLimit: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

offerSchema.index({ aircraftId: 1 });
offerSchema.index({ providerId: 1 });
offerSchema.index({ offerCode: 1 }, { unique: true });
offerSchema.index({ aircraftId: 1, isActive: 1 });
offerSchema.index({ validFrom: 1, validTo: 1 });

const OfferModel = mongoose.model("Offer", offerSchema);
export default OfferModel;