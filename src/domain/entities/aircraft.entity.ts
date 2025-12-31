import mongoose,{Document} from "mongoose";

export interface IAircraft extends Document {
 _id: string;
  providerId: string;
  aircraftType: string;
  aircraftName: string;
  manufacturer: string;
  buildYear: number;
  seatCapacity: number;
  seatLayoutType: string;
  flyingRangeKm: number;
  engineCount: number;
  lavatoryCount: number;
  baseStationId: string;
  currentLocationId: string;
  availableFrom: Date;
  status: "active" | "inactive" | "maintenance";
  createdAt: Date; 
  updatedAt: Date;
}


