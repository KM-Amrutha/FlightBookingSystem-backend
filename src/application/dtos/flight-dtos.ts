export interface CreateFlightDTO {

  flightId: string;
  flightNumber: string;
  providerId: string;
  aircraftId: string;
  departureDestinationId: string;
  arrivalDestinationId: string;
  departureTime: string;  // ISO Date string
  durationMinutes: number;
  gate?: string;
  
  baseFare: {
    economy: number;
    premiumEconomy?: number;
    business?: number;
    first?: number;
  };
  
  seatSurcharge: {
    window?: number;
    aisle?: number;
    extraLegroom?: number;
  };
  
  baggageRules: {
    freeCabinKg?: number;
    extraChargePerKg: number;
    maxExtraKg?: number;
  };
  
  // Optional - will be set by backend
  aircraftName?: string;  // populated from aircraft
  luggageRuleId?: string;
  foodMenuId?: string[];
}

export interface UpdateFlightDTO {
    
  flightNumber?: string;
  gate?: string;
  baseFare?: {
    economy?: number;
    premiumEconomy?: number;
    business?: number;
    first?: number;
  };
  seatSurcharge?: {
    window?: number;
    aisle?: number;
    extraLegroom?: number;
  };
  baggageRules?: {
    freeCabinKg?: number;
    extraChargePerKg?: number;
    maxExtraKg?: number;
  };
  foodMenuId?: string[];
}

export interface FlightListDTO {
  _id: string;
  flightId: string;
  flightNumber: string;
  aircraftName: string;
  providerId: string;
  departureDestinationId: string;
  arrivalDestinationId: string;
  departureTime: string;  // ISO string
  arrivalTime: string;
  durationMinutes: number;
  baseFare: {
    economy: number;
    premiumEconomy?: number;
    business?: number;
    first?: number;
  };
  adminApproval: {
    status: 'pending' | 'approved' | 'rejected';
    reviewedAt?: string;
  };
  flightStatus: 'scheduled' | 'cancelled' | 'completed';
}
export interface ApproveFlightDTO {
  status: 'approved' | 'rejected';
  reason?: string;  // only for rejected
}


export interface FlightDetailsDTO{
  _id: string;
  flightId: string;
  flightNumber: string;
  aircraftName: string;
  providerId: string;
  aircraftId: string;
  seatLayoutId: string;
  departureDestinationId: string;
  arrivalDestinationId: string;
  departureTime: string;  // ISO string
  arrivalTime: string;
  durationMinutes: number;
  gate?: string;
  
  // Full pricing
  baseFare: {
    economy: number;
    premiumEconomy?: number;
    business?: number;
    first?: number;
  };
  seatSurcharge: {
    window?: number;
    aisle?: number;
    extraLegroom?: number;
  };
  baggageRules: {
    freeCabinKg: number;
    extraChargePerKg: number;
    maxExtraKg?: number;
  };
  
  // Status info
  luggageRuleId?: string;
  foodMenuId?: string[];
  flightStatus: 'scheduled' | 'cancelled' | 'completed';
  adminApproval: {
    status: 'pending' | 'approved' | 'rejected';
    reviewedAt?: string;
    reason?: string;
  };
  
  createdAt: string;
  updatedAt: string;
}

