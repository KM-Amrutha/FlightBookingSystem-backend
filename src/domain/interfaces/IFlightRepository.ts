import { IFlight } from '../entities/flight.entity';
import { IBaseRepository } from './IBaseRepository';
import {
  CreateFlightDTO,
  UpdateFlightDTO,
  ApproveFlightDTO,
  FlightListDTO,
  FlightDetailsDTO
} from '@application/dtos/flight-dtos';

export interface IFlightRepository extends IBaseRepository<IFlight> {
  createFlight(data: CreateFlightDTO): Promise<FlightDetailsDTO>;
  getFlightsByProvider(providerId: string): Promise<FlightDetailsDTO[]>;
  getPendingFlightsByProvider(providerId: string): Promise<FlightDetailsDTO[]>;
  approveFlight(flightId: string, data: ApproveFlightDTO): Promise<FlightDetailsDTO | null>;
  getPendingFlightsForApproval(): Promise<FlightDetailsDTO[]>;
  getBookableFlights(): Promise<FlightListDTO[]>;
  getFlightDetails(flightId: string): Promise<FlightDetailsDTO | null>;
  isFlightBookable(flightId: string): Promise<boolean>;
  //  getLastFlightForAircraft(aircraftId: string): Promise<IFlight | null>;
}
