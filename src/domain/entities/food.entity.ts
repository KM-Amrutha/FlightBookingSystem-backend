import mongoose, { Document } from "mongoose";

export interface IFoods extends Document {
  _id: string;
  aircraftType: string;
  foodType: string;
  foodName: string;
  vegNonveg: string;
  serveMethod: string;
  isComplimentary: boolean;
  foodPrice: number;
  addImage: string;
  createdAt: Date;
}
