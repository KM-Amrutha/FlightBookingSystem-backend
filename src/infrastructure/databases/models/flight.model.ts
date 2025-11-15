import { IFlight } from "@domain/entities/flight.entity";
import mongoose, { Schema } from "mongoose";

const flightSchema: Schema = new Schema(
  {
    aircraftName: {
      type: String,
      required: true,
      trim: true
    },
    flightId: {
      type: String,
      required: true,
      trim: true
    },
    flightNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    providerId: {
      type: String,
      required: true,
      ref: "Provider"
    },
    aircraftId: {
      type: String,
      required: true,
      ref: "Aircraft"
    },
    departureDestinationId: {
      type: String,
      required: true,
      ref: "Destination"
    },
    arrivalDestinationId: {
      type: String,
      required: true,
      ref: "Destination"
    },
    departureTime: {
      type: Date,
      required: true
    },
    arrivalTime: {
      type: Date,
      required: true
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 0
    },
    altitudeFt: {
      type: Number,
      required: true,
      min: 0
    },
    gate: {
      type: String,
      trim: true
    },
    priceForEconomy: {
      type: String,
      required: true
    },
    priceForFirstclass: {
      type: String,
      required: true
    },
    priceForBusinessclass: {
      type: String,
      required: true
    },
    priceForWindow: {
      type: String,
      required: true
    },
    baggageAbove7kg: {
      type: String,
      required: true
    },
    baggageAbove20kg: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: ["scheduled", "delayed", "cancelled", "completed"],
      default: "scheduled"
    }
  },
  { timestamps: true }
);

flightSchema.index({ flightNumber: 1 });
flightSchema.index({ providerId: 1 });
flightSchema.index({ departureTime: 1 });
flightSchema.index({ departureDestinationId: 1, arrivalDestinationId: 1 });
flightSchema.index({ status: 1 });

const FlightModel = mongoose.model<IFlight>("Flight", flightSchema);
export default FlightModel;
