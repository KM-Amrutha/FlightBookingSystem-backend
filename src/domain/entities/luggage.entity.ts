import mongoose, { Document } from "mongoose";

export interface ILuggage extends Document {
  _id: string;
  passengerId: string;
  isWeightAbove7kg: boolean;
  isWeightAbove20kg: boolean;
  extraCharge7kg: number;
  extraCharge20kg: number;
  createdAt: Date;
  updatedAt: Date;
}
