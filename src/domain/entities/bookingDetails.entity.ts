import mongoose, { Document } from "mongoose";

export interface IBookingDetails extends Document {
  _id: string;
  segmentId: string;
  passengerId: string;
  seatId: string;
  price: number;
  ticketNumber: string;
  terminal: string;
  foodTypeId: string;
  baggageWeightKg: number;
  baggageExtraCharge: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
