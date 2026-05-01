import mongoose, { Schema } from "mongoose";

const bookingPassengerSegmentSchema = new Schema(
  {
    flightId: { type: String, required: true },
    flightNumber: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    departureTime: { type: Date, required: true },
    arrivalTime: { type: Date, required: true },
    flightSeatId: { type: String, required: true },
    seatNumber: { type: String, required: true },
    cabinClass: { type: String, required: true },
    position: { type: String, required: true },
    baseFare: { type: Number, required: true },
    seatSurcharge: { type: Number, required: true },
    luggageCharge: { type: Number, required: true },
    segmentFare: { type: Number, required: true },
    status: {
      type: String,
      enum: ["active", "cancelled"],
      default: "active",
    },
    cancelledAt: { type: Date, default: null },
  },
  { _id: false }
);

const bookingPassengerSchema = new Schema(
  {
    passengerId: { type: String, required: true },
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    address: { type: String, required: true },
    mobile: { type: String, required: true },
    extraLuggageKg: { type: Number, required: true, default: 0 },
    segments: { type: [bookingPassengerSegmentSchema], required: true },
    passengerTotal: { type: Number, required: true },
    status: {
      type: String,
      enum: ["active", "cancelled"],
      default: "active",
    },
    cancelledAt: { type: Date, default: null },
    refundAmount: { type: Number, default: null },
  },
  { _id: false }
);

const bookingFlightFoodSchema = new Schema(
  {
    flightId: { type: String, required: true },
    aircraftId: { type: String, required: true },
    items: [
      {
        foodId: { type: String, required: true },
        foodName: { type: String, required: true },
        foodPrice: { type: Number, required: true },
        quantity: { type: Number, required: true },
        itemTotal: { type: Number, required: true },
        _id: false,
      },
    ],
    flightFoodTotal: { type: Number, required: true },
  },
  { _id: false }
);

const bookingSegmentSchema = new Schema(
  {
    flightId: { type: String, required: true },
    flightNumber: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    departureTime: { type: Date, required: true },
    arrivalTime: { type: Date, required: true },
  },
  { _id: false }
);

const bookingSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    segments: { type: [bookingSegmentSchema], required: true },
    passengers: { type: [bookingPassengerSchema], required: true },
    flightFoods: { type: [bookingFlightFoodSchema], default: [] },
    subtotal: { type: Number, required: true },
    discount: { type: Number, required: true, default: 0 },
    grandTotal: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "payment_failed", "cancelled"],
      default: "pending",
    },
    paymentIntentId: { type: String, default: null },
    paymentConfirmedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

bookingSchema.index({ userId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ "passengers.passengerId": 1 });
bookingSchema.index({ "segments.flightId": 1 });
bookingSchema.index({ createdAt: -1 });

const BookingModel = mongoose.model("Booking", bookingSchema);
export default BookingModel;