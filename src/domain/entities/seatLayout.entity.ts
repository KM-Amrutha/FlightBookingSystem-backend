import mongoose, { Document } from "mongoose";

export interface ISeatLayout extends Document {
  _id: string;
  aircraftId: string;
  cabinClass: string; // "economy" | "premium_economy" | "business" | "first"
  layout: string; // "3-3", "2-4-2", "3-3-3", "1-2-1"
  startRow: number;
  endRow: number;
  totalRows: number;
  seatsPerRow: number;
  columns: string[]; // ["A", "B", "C", "D", "E", "F"] 
  aisleColumns: string[]; // ["C-D"] means aisle between C and D
  exitRows: number[]; //  [12, 13] - which rows are exit rows
  wingStartRow: number;
  wingEndRow: number;
  createdAt: Date;
  updatedAt: Date; 
}
