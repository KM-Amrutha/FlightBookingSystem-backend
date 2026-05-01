import { FlightDetailsDTO } from "@application/dtos/flight-dtos";

export interface IDeleteFlightUseCase {
  execute(flightId: string, providerId: string): Promise<FlightDetailsDTO>;
}