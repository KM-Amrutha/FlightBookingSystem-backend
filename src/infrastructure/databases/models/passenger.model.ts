import { IPassenger } from "@domain/entities/passenger.entity";
import mongoose, { Schema } from "mongoose";

const passengerSchema: Schema = new Schema(
  {
    bookingId: {
      type: String,
      required: true,
      ref: "Booking"
    },
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"]
    },
    dob: {
      type: Date,
      required: true
    },
    mobile: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

passengerSchema.index({ bookingId: 1 });
passengerSchema.index({ mobile: 1 });

const PassengerModel = mongoose.model<IPassenger>("Passenger", passengerSchema);
export default PassengerModel;
