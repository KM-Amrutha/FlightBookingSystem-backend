import mongoose, { Schema, model } from "mongoose";
import { ISeatType } from "domain/entities/seatType.entity";

const seatTypeSchema = new Schema<ISeatType>(
  {
    seatTypeName: {
      type: String,
      required: [true, "Seat type name is required"],
      trim: true,
      enum: {
        values: ["Economy", "Premium Economy", "Business", "First"],
        message: "{VALUE} is not a valid seat type"
      }
    },
    cabinClass: {
      type: String,
      required: [true, "Cabin class is required"],
      lowercase: true,
      enum: ["economy", "premium_economy", "business", "first"]
    },
    basePriceMultiplier: {
      type: Number,
      required: [true, "Base price multiplier is required"],
      min: [0.5, "Multiplier cannot be less than 0.5"],
      max: [10, "Multiplier cannot exceed 10"]
    },
    features: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

seatTypeSchema.index({ seatTypeName: 1 });
seatTypeSchema.index({ cabinClass: 1 });


 const SeatType = model<ISeatType>("SeatType", seatTypeSchema);
export default SeatType;