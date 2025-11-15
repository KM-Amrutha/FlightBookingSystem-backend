import { IBookingSegment } from "@domain/entities/bookingSegment.entity";
import mongoose, { Schema } from "mongoose";

const bookingSegmentSchema: Schema = new Schema(
  {
    bookingIds: {
      type: [String],
      required: true,
      ref: "Booking"
    },
    passengerCount: {
      type: Number,
      required: true,
      min: 1
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    mobile: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

bookingSegmentSchema.index({ email: 1 });
bookingSegmentSchema.index({ mobile: 1 });
bookingSegmentSchema.index({ createdAt: -1 });

const BookingSegmentModel = mongoose.model<IBookingSegment>(
  "BookingSegment",
  bookingSegmentSchema
);
export default BookingSegmentModel;
