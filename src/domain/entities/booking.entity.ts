import mongoose, { Document } from "mongoose";

export interface IBooking extends Document {
  _id: string;
  flightId: string;
  userId: string;
  originDestinationId: string;
  finalDestinationId: string;
  departureTime: Date;
  arrivalTime: Date;
  bookingDate: Date;
  originalPrice: number;
  discountAmount: number;
  bookingStatus: "pending" | "confirmed" | "cancelled" | "completed";
  tripType: "one-way" | "round-trip";
  createdAt: Date;
  updatedAt: Date;
}
