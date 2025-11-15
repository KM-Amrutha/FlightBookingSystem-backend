import mongoose, { Document } from "mongoose";

export interface IBookingSegment extends Document {
  _id: string;
  bookingIds: string[];
  passengerCount: number;
  email: string;
  mobile: string;
  createdAt: Date;
  updatedAt: Date;
}
