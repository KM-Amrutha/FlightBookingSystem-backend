import { Document } from "mongoose";

export interface IDestination extends Document {
  _id: string;
  name: string;
  iataCode: string;
  icaoCode?: string;
  municipality: string;
  isoCountry: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
