import { IBooking } from "@domain/entities/booking.entity";
import mongoose, { Schema } from "mongoose";

const bookingSchema: Schema = new Schema(
  {
    flightId: {
      type: String,
      required: true,
      ref: "Flight"
    },
    userId: {
      type: String,
      required: true,
      ref: "User"
    },
    originDestinationId: {
      type: String,
      required: true,
      ref: "Destination"
    },
    finalDestinationId: {
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
    bookingDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    originalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    bookingStatus: {
      type: String,
      required: true,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending"
    },
    tripType: {
      type: String,
      required: true,
      enum: ["one-way", "round-trip"]
    }
  },
  { timestamps: true }
);

bookingSchema.index({ userId: 1 });
bookingSchema.index({ flightId: 1 });
bookingSchema.index({ bookingStatus: 1 });
bookingSchema.index({ bookingDate: -1 });

const BookingModel = mongoose.model<IBooking>("Booking", bookingSchema);
export default BookingModel;
