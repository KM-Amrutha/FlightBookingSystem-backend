import mongoose, { Schema, model } from "mongoose";
import { ISeatType } from "@domain/entities/seatType.entity";

const seatTypeSchema = new Schema<ISeatType>(
  {
    seatTypeName: {
      type: String,
      required: [true, "Seat type name is required"],
      trim: true,
      unique: true,
      enum: {
        values: ["Economy", "Premium Economy", "Business", "First"],
        message: "{VALUE} is not a valid seat type"
      }
    },
    cabinClass: {
      type: String,
      required: [true, "Cabin class is required"],
      lowercase: true,
      unique: true,
      enum: {
        values: ["economy", "premium_economy", "business", "first"],
        message: "{VALUE} is not a valid cabin class"
      }
    },
    basePriceMultiplier: {
      type: Number,
      required: [true, "Base price multiplier is required"],
      min: [1, "Multiplier cannot be less than 1"],
      max: [10, "Multiplier cannot exceed 10"]
    },
    seatPitch: {
      type: Number,
      required: [true, "Seat pitch is required"],
      min: [28, "Seat pitch must be at least 28 inches"],
      max: [84, "Seat pitch cannot exceed 84 inches"]
    },
    seatWidth: {
      type: Number,
      required: [true, "Seat width is required"],
      min: [16, "Seat width must be at least 16 inches"],
      max: [24, "Seat width cannot exceed 24 inches"]
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
