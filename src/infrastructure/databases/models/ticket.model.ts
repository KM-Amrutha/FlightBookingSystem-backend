import mongoose, { Schema } from "mongoose";

const ticketPassengerSegmentSchema = new Schema(
  {
    flightId: { type: String, required: true },
    flightNumber: { type: String, required: true },
    from: { type: String, required: true },
    fromName: { type: String, required: true },
    to: { type: String, required: true },
    toName: { type: String, required: true },
    departureTime: { type: Date, required: true },
    arrivalTime: { type: Date, required: true },
    seatNumber: { type: String, required: true },
    cabinClass: { type: String, required: true },
    position: { type: String, required: true },
    baseFare: { type: Number, required: true },
    seatSurcharge: { type: Number, required: true },
    luggageCharge: { type: Number, required: true },
    segmentFare: { type: Number, required: true },
    providerName: { type: String, required: true },
    providerLogo: { type: String },
    aircraftName: { type: String, required: true },
    manufacturer: { type: String, required: true },
    gate: { type: String },
    durationMinutes: { type: Number, required: true },
    baggageRules: {
      freeCabinKg: { type: Number, required: true },
      extraChargePerKg: { type: Number, required: true },
      maxExtraKg: { type: Number },
    },
  },
  { _id: false }
);

const ticketPassengerSchema = new Schema(
  {
    passengerId: { type: String, required: true },
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    mobile: { type: String, required: true },
    segment: { type: ticketPassengerSegmentSchema, required: true },
    segmentTotal: { type: Number, required: true },
  },
  { _id: false }
);

const ticketFlightFoodSchema = new Schema(
  {
    flightId: { type: String, required: true },
    flightNumber: { type: String, required: true },
    items: [
      {
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

const ticketSchema: Schema = new Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ticketNumber: { type: String, required: true, unique: true },
    passengerIndex: { type: Number, required: true },
    flightIndex: { type: Number, required: true },
    issuedAt: { type: Date, required: true },
    passenger: { type: ticketPassengerSchema, required: true },
    flightFood: { type: ticketFlightFoodSchema },
    fareBreakdown: {
      subtotal: { type: Number, required: true },
      discount: { type: Number, required: true },
      grandTotal: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

// ── compound unique index: one ticket per passenger per flight per booking ──
ticketSchema.index(
  { bookingId: 1, passengerIndex: 1, flightIndex: 1 },
  { unique: true }
);

const TicketModel = mongoose.model("Ticket", ticketSchema);
export default TicketModel;