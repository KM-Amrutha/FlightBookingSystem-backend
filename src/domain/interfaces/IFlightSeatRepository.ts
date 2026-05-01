import { IFlightSeat } from "../entities/flightSeat.entity";

export interface IFlightSeatRepository {

  // Called inside CreateFlightUseCase
  // Bulk insert all seats for a flight copied from aircraft seats
  createFlightSeats(seats: Partial<IFlightSeat>[]): Promise<IFlightSeat[]>;

  // Get all seats for a flight (seat map)
  getFlightSeatsByFlightId(flightId: string): Promise<IFlightSeat[]>;

  // Get seats filtered by cabin class (seat map per class)
  getFlightSeatsByClass(flightId: string, cabinClass: string): Promise<IFlightSeat[]>;

  // Get single seat (validate before locking)
  getFlightSeatById(flightSeatId: string): Promise<IFlightSeat | null>;

  // Soft lock — called when user selects a seat
  lockSeat(
    flightSeatId: string,
    userId: string,
    lockedUntil: Date
  ): Promise<IFlightSeat | null>;

  // Release soft lock — called on payment failure or TTL expiry
  unlockSeat(flightSeatId: string): Promise<IFlightSeat | null>;

  // Mark as permanently booked — called on payment confirmed (inside transaction)
  bookSeat(flightSeatId: string, bookingId: string): Promise<IFlightSeat | null>;

  // Release booked seat — called on passenger cancellation
  releaseSeat(flightSeatId: string): Promise<IFlightSeat | null>;

  // Release all stale locks (lockedUntil < now) — for cleanup job
  releaseStaleLockes(): Promise<number>;

  // Check if seat is available (not booked, not locked, not blocked)
  isSeatAvailable(flightSeatId: string): Promise<boolean>;

  // Count available seats per cabin class — used in search results
  countAvailableSeats(flightId: string, cabinClass: string): Promise<number>;

  // Delete all flight seats when flight is deleted
  deleteFlightSeatsByFlightId(flightId: string): Promise<void>;
}