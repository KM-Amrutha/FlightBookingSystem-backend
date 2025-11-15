import mongoose, { Document } from "mongoose";

export interface ISeatType extends Document {
  _id: string;
  seatTypeName: string; // "Economy", "Business", "First"
  cabinClass: string; // standardized class
  basePriceMultiplier: number; // 1.0 for economy, 3.0 for business
  features: string[];
  createdAt: Date;
}
