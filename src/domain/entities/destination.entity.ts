import mongoose, { Document } from "mongoose";

export interface IDestination extends Document {
  _id: string;
  airportCode: string;
  airportName: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
}
