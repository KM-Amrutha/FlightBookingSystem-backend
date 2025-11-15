import mongoose, { Document } from "mongoose";

export interface IPassenger extends Document {
  _id: string;
  bookingId: string;
  firstName: string;
  lastName: string;
  gender: "male" | "female" | "other";
  dob: Date;
  mobile: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}
