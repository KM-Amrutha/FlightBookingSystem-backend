import mongoose, { Schema,model } from "mongoose";
import { ISeat } from "@domain/entities/seat.entity";


const seatSchema = new Schema<ISeat>(
  {
    aircraftId: {
      type: String,
      required: [true, "Aircraft ID is required"],
      ref: "Aircraft"
    },
    seatTypeId: {
      type: String,
      required: [true, "Seat type ID is required"],
      ref: "SeatType"
    },
    seatNumber: {
      type: String,
      required: [true, "Seat number is required"],
      trim: true,
      uppercase: true,
      match: [/^\d{1,2}[A-Z]$/, "Seat number must be in format like 12A"]
    },
    rowNumber: {
      type: Number,
      required: [true, "Row number is required"],
      min: [1, "Row number must be at least 1"],
      max: [100, "Row number cannot exceed 100"]
    },
    columnPosition: {
      type: String,
      required: [true, "Column position is required"],
      uppercase: true,
      match: [/^[A-K]$/, "Column must be a single letter A-K"]
    },
    section: {
      type: String,
      required: [true, "Section is required"],
      lowercase: true,
      enum: {
        values: ["front", "middle", "rear", "overwing"],
        message: "{VALUE} is not a valid section"
      }
    },
    position: {
      type: String,
      required: [true, "Position is required"],
      lowercase: true,
      enum: {
        values: ["window", "middle", "aisle"],
        message: "{VALUE} is not a valid position"
      }
    },
    isExitRow: {
      type: Boolean,
      default: false
    },
    isBlocked: {
      type: Boolean,
      default: false
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

seatSchema.index({ aircraftId: 1, seatNumber: 1 }, { unique: true });
seatSchema.index({ aircraftId: 1, rowNumber: 1 });
seatSchema.index({ aircraftId: 1, seatTypeId: 1 });
seatSchema.index({ aircraftId: 1, isBlocked: 1 });
seatSchema.index({ position: 1, isExitRow: 1 });

const Seat = model<ISeat>("Seat", seatSchema);

export default Seat;