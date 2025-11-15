import { IAircraft } from "@domain/entities/aircraft.entity";
import mongoose, { Schema } from "mongoose";

const aircraftSchema: Schema = new Schema(
  {
    providerId: {
      type: String,
      required: true,
      ref: "Provider"
    },
    aircraftType: {
      type: String,
      required: true,
      trim: true
    },
    aircraftName: {
      type: String,
      required: true,
      trim: true
    },
    manufacturer: {
      type: String,
      required: true,
      trim: true
    },
    buildYear: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear()
    },
    seatCapacity: {
      type: Number,
      required: true,
      min: 1
    },
    seatLayoutType: {
      type: String,
      required: true,
      trim: true
    },
    flyingRangeKm: {
      type: Number,
      required: true,
      min: 0
    },
    engineCount: {
      type: Number,
      required: true,
      min: 1
    },
    lavatoryCount: {
      type: Number,
      required: true,
      min: 0
    },
    baseStationId: {
      type: String,
      required: true,
      ref: "Destination"
    },
    currentLocationId: {
      type: String,
      required: true,
      ref: "Destination"
    },
    availableFrom: {
      type: Date,
      required: true,
      default: Date.now
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "inactive", "maintenance"],
      default: "active"
    }
  },
  { timestamps: true }
);

aircraftSchema.index({ providerId: 1 });
aircraftSchema.index({ status: 1 });
aircraftSchema.index({ aircraftType: 1 });

const AircraftModel = mongoose.model<IAircraft>("Aircraft", aircraftSchema);
export default AircraftModel;
