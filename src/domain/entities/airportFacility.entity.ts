import mongoose, { Document } from "mongoose";

export interface IAirportFacility extends Document {
  _id: string;
  destinationId: string;
  facilityName: string;
  facilityType: string;
  description: string;
  locationDetails: string;
  createdAt: Date;
  updatedAt: Date;
}
