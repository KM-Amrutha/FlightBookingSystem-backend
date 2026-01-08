import mongoose, { Document } from "mongoose";

export interface IFlight extends Document {
  _id: string;
  aircraftName: string;
  flightId: string;
  flightNumber: string;
  providerId: string;
  aircraftId: string;
  seatLayoutId: string;

  departureDestinationId: string;
  arrivalDestinationId: string;
  departureTime: Date;
  arrivalTime: Date;
  durationMinutes: number;

  gate: string;
  baseFare: {
    economy?: number;
    premiumEconomy?: number;
    business?: number;
    first?: number;
  };
  seatSurcharge: {
    window?: number;
    aisle?: number;
    extraLegroom?: number;
  };

  baggageRules?: {
    freeCabinKg: number;          // e.g. 7
    extraChargePerKg: number;    // charge per 2kg block above free limit
    maxExtraKg?: number;          // optional upper cap, e.g. 23 or 30
  };
 luggageRuleId?: string; // if you later create a luggage rule entity
  foodMenuId?: [];
  flightStatus: "scheduled"| "cancelled" | "completed";
  
   adminApproval: {
    status: "pending" | "approved" | "rejected";
    reviewedAt?: Date;
    reason?: string|null;       // rejection reason
  };
  createdAt: Date;
  updatedAt: Date;
}
