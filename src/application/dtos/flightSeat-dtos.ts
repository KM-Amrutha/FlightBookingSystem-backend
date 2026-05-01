export interface FlightSeatDTO {
  _id: string;
  flightId: string;
  aircraftId: string;
  seatId: string;

  seatNumber: string;
  rowNumber: number;
  columnPosition: string;
  section: string;
  position: string;
  cabinClass: string;
  isExitRow: boolean;
  features: string[];

  // Availability
  isBooked: boolean;
  isBlocked: boolean;
  isLocked: boolean;
  lockedUntil?: string; // ISO string

  // Fare — calculated at query time from Flight document
  fare: number;

  bookingId?: string;

  createdAt: string;
  updatedAt: string;
}

// INPUT DTO — used when creating flight seats in bulk
export interface CreateFlightSeatDTO {
  flightId: string;
  aircraftId: string;
  seatId: string;
  seatNumber: string;
  rowNumber: number;
  columnPosition: string;
  section: string;
  position: string;
  cabinClass: string;
  isExitRow: boolean;
  features: string[];
  isBooked: boolean;
  isBlocked: boolean;
  isLocked: boolean;
}

// OUTPUT DTO — seat map grouped by cabin class
export interface FlightSeatMapDTO {
  flightId: string;
  cabinClass: string;
  baseFare: number;
  seatSurcharge: {
    window?: number;
    aisle?: number;
    extraLegroom?: number;
  };
  seats: FlightSeatDTO[];
}

// OUTPUT DTO — available seat count per class (used in search results)
export interface SeatAvailabilityDTO {
  flightId: string;
  availability: {
    economy?: number;
    premium_economy?: number;
    business?: number;
    first?: number;
  };
}