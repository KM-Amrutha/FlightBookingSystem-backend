export interface IFlightSeat {
  id: string;

  // References
  flightId: string;
  aircraftId: string;
  seatId: string;          // ref to original ISeat

  // Copied from ISeat at flight creation
  seatNumber: string;      // "12A"
  rowNumber: number;       // 12
  columnPosition: string;  // "A"
  section: string;         // "front" | "middle" | "rear" | "overwing"
  position: string;        // "window" | "middle" | "aisle"
  cabinClass: string;      // "economy" | "premium_economy" | "business" | "first"
  isExitRow: boolean;
  features: string[];      // ["extra legroom", "power outlet"]

  // Availability
  isBooked: boolean;       // confirmed payment — permanent
  isBlocked: boolean;      // blocked by provider

  // Soft lock
  isLocked: boolean;
  lockedByUserId?: string;
  lockedUntil?: Date;      // fallback if Redis crashes

  // Set when isBooked = true
  bookingId?: string;

  createdAt: Date;
  updatedAt: Date;
}