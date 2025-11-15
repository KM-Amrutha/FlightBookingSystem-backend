
import { IBookingDetails } from "@domain/entities/bookingDetails.entity";
import mongoose, { Schema } from "mongoose";

const bookingDetailsSchema: Schema = new Schema(
  {
    segmentId: {
      type: String,
      required: true,
      ref: "BookingSegment"
    },
    passengerId: {
      type: String,
      required: true,
      ref: "Passenger"
    },
    seatId: {
      type: String,
      required: true,
      ref: "Seat"
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    terminal: {
      type: String,
      trim: true
    },
    foodTypeId: {
      type: String,
      ref: "Foods"
    },
    baggageWeightKg: {
      type: Number,
      default: 0,
      min: 0
    },
    baggageExtraCharge: {
      type: Number,
      default: 0,
      min: 0
    },
    status: {
      type: String,
      required: true,
      enum: ["confirmed", "cancelled", "completed"],
      default: "confirmed"
    }
  },
  { timestamps: true }
);

bookingDetailsSchema.index({ segmentId: 1 });
bookingDetailsSchema.index({ passengerId: 1 });
bookingDetailsSchema.index({ ticketNumber: 1 });
bookingDetailsSchema.index({ status: 1 });

const BookingDetailsModel = mongoose.model<IBookingDetails>(
  "BookingDetail",
  bookingDetailsSchema
);
export default BookingDetailsModel;
