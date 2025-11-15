import mongoose, { Document } from "mongoose";

export interface ISeat extends Document {
 _id: string;
  aircraftId: string;
  seatTypeId: string;
  seatNumber: string; // "12A", "15F"
  rowNumber: number; // 12
  columnPosition: string; // "A"
  section: string; // "front" | "middle" | "rear" | "overwing"
  position: string; // "window" | "middle" | "aisle"
  isExitRow: boolean;
  isBlocked: boolean; // for lavatories, galleys
  features: string[]; // ["extra legroom", "power outlet"]
  createdAt: Date;
}
