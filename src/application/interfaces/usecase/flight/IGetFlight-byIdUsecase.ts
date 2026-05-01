import {FlightDetailsDTO} from "@application/dtos/flight-dtos";

export interface IGetFlightByIdUseCase {
  execute(providerId: string, flightId: string): Promise<FlightDetailsDTO>;
}