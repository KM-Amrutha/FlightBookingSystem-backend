import { IFlight } from '../entities/flight.entity';
import { IBaseRepository } from './IBaseRepository';

export interface IFlightRepository extends IBaseRepository<IFlight> {
  createFlight(data: Partial<IFlight>): Promise<IFlight>;
  getFlightsByProvider(
  providerId: string,
  page: number,
  limit: number
): Promise<{
  flights: IFlight[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}>;
  updateFlight(flightId: string, data: Partial<IFlight>): Promise<IFlight | null>;
  // not used aanu ee getPendingFlightsByProvider.
  getPendingFlightsByProvider(providerId: string): Promise<IFlight[]>;

  getPendingFlightsForApproval(): Promise<IFlight[]>;
  approveFlight(flightId: string, status: "approved" | "rejected", reason?: string): Promise<IFlight | null>;
  approveFlightsByGroupId(recurringGroupId: string, status: "approved" | "rejected", reason?: string): Promise<void>;
  approveReturnFlight(parentFlightId: string, status: "approved" | "rejected", reason?: string): Promise<void>;
  getAllFlightsForAdmin(page: number,limit: number): Promise<{flights: IFlight[];totalCount: number;currentPage: number;totalPages: number;}>;

  getFlightDetails(flightId: string): Promise<IFlight | null>;
  getBookableFlights(): Promise<IFlight[]>;
  isFlightBookable(flightId: string): Promise<boolean>;
  searchFlights(fromCodes: string[],toCodes: string[],departureDateStart: Date,departureDateEnd: Date): Promise<IFlight[]>;
  hasActiveFlightsForAircraft(aircraftId: string): Promise<boolean>;
  deleteFlightById(flightId: string): Promise<IFlight|null>;
   getActiveFlightsForAircraft(aircraftId: string): Promise<IFlight[]>;

}