export interface IFlight {
  id: string;
  aircraftName: string;
  flightId: string;
  flightNumber: string;
  providerId: string;
  aircraftId: string;
  seatLayoutId: string;
  
  flightType: "outbound" | "return" | "recurring";
  parentFlightId?: string;
  recurringGroupId?: string;
  recurringDays?: number[];

  departureDestinationId: string;
  arrivalDestinationId: string;
  departureTime: Date;
  arrivalTime: Date;
  durationMinutes: number;
  bufferMinutes: number; // new field for buffer time around flight times

   departureDestination?: {
    name: string;
    iataCode: string;
  };
  arrivalDestination?: {
    name: string;
    iataCode: string;
  };

  gate: string;
  baseFare: {
    economy?: number;
    premium_economy?: number;
    business?: number;
    first?: number;
  };
  seatSurcharge: {
    window?: number;
    aisle?: number;
    extraLegroom?: number;
  };

  baggageRules?: {
    freeCabinKg?: number;          // e.g. 7
    extraChargePerKg?: number;    // charge per 2kg block above free limit
    maxExtraKg?: number;          // optional upper cap, e.g. 23 or 30
  };
 luggageRuleId?: string|null; // if you later create a luggage rule entity
  foodMenuId?: string[];
  flightStatus: "scheduled"| "cancelled" | "completed";
  
   adminApproval: {
    status: "pending" | "approved" | "rejected";
    reviewedAt?: Date;
    reason?: string|null;       // rejection reason
  };
  createdAt: Date;
  updatedAt: Date;

  
}