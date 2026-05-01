import {FlightDetailsDTO} from "@application/dtos/flight-dtos";

export interface IRejectSingleFlightUseCase {
  execute(flightId: string, reason: string): Promise<FlightDetailsDTO>;
}