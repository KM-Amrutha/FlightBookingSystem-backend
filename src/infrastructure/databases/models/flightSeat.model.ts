import mongoose, { Schema } from "mongoose";
const flightSeatSchema = new Schema(
  {
    flightId: {
      type: String,
      required: [true, "Flight ID is required"],
      ref: "Flight",
      index: true
    },
    aircraftId: {
      type: String,
      required: [true, "Aircraft ID is required"],
      ref: "Aircraft",
      index: true
    },
    seatId: {
      type: String,
      required: [true, "Seat ID is required"],
      ref: "Seat"
    },

    // Copied from ISeat at flight creation
    seatNumber: {
      type: String,
      required: [true, "Seat number is required"],
      trim: true,
      uppercase: true,
      match: [/^\d{1,2}[A-K]$/, "Seat number must be in format like 12A"]
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
    cabinClass: {
      type: String,
      required: [true, "Cabin class is required"],
      lowercase: true,
      enum: {
        values: ["economy", "premium_economy", "business", "first"],
        message: "{VALUE} is not a valid cabin class"
      }
    },
    isExitRow: {
      type: Boolean,
      default: false
    },
    features: {
      type: [String],
      default: []
    },

    // Availability
    isBooked: {
      type: Boolean,
      default: false,
      index: true
    },
    isBlocked: {
      type: Boolean,
      default: false,
      index: true
    },

    // Soft lock
    isLocked: {
      type: Boolean,
      default: false,
      index: true
    },
    lockedByUserId: {
      type: String,
      ref: "User"
    },
    lockedUntil: {
      type: Date
    },

    // Set when confirmed
    bookingId: {
      type: String,
      ref: "Booking"
    }
  },
  {
    timestamps: true
  }
);

// Unique seat per flight
flightSeatSchema.index({ flightId: 1, seatNumber: 1 }, { unique: true });

// Seat map queries — most common query
flightSeatSchema.index({ flightId: 1, cabinClass: 1 });

// Availability filter
flightSeatSchema.index({ flightId: 1, isBooked: 1, isLocked: 1, isBlocked: 1 });

// Lock cleanup (find stale locks)
flightSeatSchema.index({ isLocked: 1, lockedUntil: 1 });

const FlightSeatModel = mongoose.model("FlightSeat", flightSeatSchema);
export default FlightSeatModel;