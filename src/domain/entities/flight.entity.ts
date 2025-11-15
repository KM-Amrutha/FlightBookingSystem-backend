import mongoose, { Document } from "mongoose";

export interface IFlight extends Document {
  _id: string;
  aircraftName: string;
  flightId: string;
  flightNumber: string;
  providerId: string;
  aircraftId: string;
  departureDestinationId: string;
  arrivalDestinationId: string;
  departureTime: Date;
  arrivalTime: Date;
  durationMinutes: number;
  altitudeFt: number;
  gate: string;
  priceForEconomy: number;
  priceForFirstclass: number;
  priceForBusinessclass: number;
  priceForWindow: number;
  baggageAbove7kg: number;
  baggageAbove20kg: number;
  status: "scheduled" | "delayed" | "cancelled" | "completed";
  createdAt: Date;
}
