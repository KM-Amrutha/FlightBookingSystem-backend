export interface CreateFlightDTO {

  flightId: string;
  flightNumber: string;
  providerId: string;
  aircraftId: string;
   seatLayoutId?: string;  
  departureDestinationId: string;
  arrivalDestinationId: string;
  departureTime: string;  // ISO Date string
  durationMinutes: number;
  bufferMinutes: number;    // minimum time between outbound and return, e.g. 120 for 2 hours
  gate?: string;
  
  baseFare: {
    economy: number;
    premium_economy?: number;
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
  flightType?: "outbound" | "return" | "recurring";
  parentFlightId?: string;
  recurringGroupId?: string;
  recurringDays?: number[];
}

export interface UpdateFlightDTO {
    
  flightNumber?: string;
  gate?: string;
  durationMinutes?: number;  // Changing duration affects arrival time
  arrivalDestinationId?: string;
  baseFare?: {
    economy?: number;
    premium_economy?: number;
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
  luggageRuleId?: string | null;
  foodMenuId?: string[];
}

export interface FlightListDTO {
  _id: string;
  flightId: string;
  flightNumber: string;
  aircraftName: string;
  providerId: string;
  providerName?:string;
  flightType: "outbound" | "return" | "recurring";  
  parentFlightId?: string;                           
  recurringGroupId?: string; 
  recurringDays?: number[];
  departureDestinationId: string;
  arrivalDestinationId: string;
  departureTime: string;  // ISO string
  arrivalTime: string;
  durationMinutes: number;
  gate?: string;
seatSurcharge: {
  window?: number;
  aisle?: number;
  extraLegroom?: number;
};
  baseFare: {
    economy: number;
    premium_economy?: number;
    business?: number;
    first?: number;
  };
   baggageRules: {
    freeCabinKg: number;
    extraChargePerKg: number;
    maxExtraKg?: number;
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
  flightType: "outbound" | "return" | "recurring"; 
  parentFlightId?: string;                          
  recurringGroupId?: string;                         
  recurringDays?: number[]; 
  departureDestinationId: string;
  arrivalDestinationId: string;
  departureTime: string;  // ISO string
  arrivalTime: string;
  durationMinutes: number;
  bufferMinutes?: number;    // minimum time between outbound and return, e.g. 120 for 2 hours
  gate?: string;
  
  // Full pricing
  baseFare: {
    economy: number;
    premium_economy?: number;
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
   departureDestination?: {
    name: string;
    iataCode: string;
  };
  arrivalDestination?: {
    name: string;
    iataCode: string;
  };
  
  createdAt: string;
  updatedAt: string;
}

export interface SearchFlightsDTO {
  from: string;
  to: string;
  departureDate: string;
  passengers: number;
  tripType: "one-way" | "round-trip";
  returnDate?: string;
  page?: number;
  limit?: number;
}

export interface SearchFlightResultDTO {
  _id: string;
  flightId: string;
  flightNumber: string;
  aircraftName: string;

  departure: {
    destinationId: string;
    name: string;
    iataCode: string;
    time: string;  // ISO string
  };

  arrival: {
    destinationId: string;
    name: string;
    iataCode: string;
    time: string;  // ISO string
  };

  durationMinutes: number;
  gate?: string;

  baseFare: {
    economy: number;
    premium_economy?: number;
    business?: number;
    first?: number;
  };

  baggageRules: {
    freeCabinKg: number;
    extraChargePerKg: number;
    maxExtraKg?: number;
  };

  flightStatus: "scheduled" | "cancelled" | "completed";
  availableClasses: Array<"economy" | "premium_economy" | "business" | "first">;
}

export interface SearchFlightResponseDTO {
  outbound: SearchFlightResultDTO[];
  return?: SearchFlightResultDTO[];
  pagination: {
    outbound: { currentPage: number; totalPages: number; totalCount: number };
    return?: { currentPage: number; totalPages: number; totalCount: number };
  };
}

export interface CreateRecurringFlightDTO {
  // route
  aircraftId: string;
  departureDestinationId: string;
  arrivalDestinationId: string;

  // schedule
  baseFlightId: string;        // e.g. "FL-2025-001" → occurrences become "FL-2025-001-1", "FL-2025-001-2"
  baseFlightNumber: string;    // e.g. "AI101" → occurrences become "AI101-1", "AI101-2"
  departureTimeOfDay: string;  // "HH:mm" — same time every day e.g. "10:00"
  startDate: string;           // ISO date string "2025-05-01"
  endDate: string;             // ISO date string "2025-05-31" — max 30 days from startDate
  weekdays: number[];          // [0,1,2,3,4,5,6] 0=Sun, 1=Mon ... 6=Sat
  durationMinutes: number;
  bufferMinutes: number;    
       // minimum time between outbound and return, e.g. 120 for 2 hours

  // pricing — same for all occurrences, editable per flight later
  gate?: string;
  baseFare: {
    economy: number;
    premium_economy?: number;
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
  luggageRuleId?: string;
  foodMenuId?: string[];
  seatLayoutId?: string;
}

export interface RecurringFlightResultDTO {
  created: FlightDetailsDTO[];       // successfully created outbound flights
  skipped: {
    date: string;
    reason: string;
  }[];                               // skipped dates with reasons
  totalCreated: number;
  totalSkipped: number;
}