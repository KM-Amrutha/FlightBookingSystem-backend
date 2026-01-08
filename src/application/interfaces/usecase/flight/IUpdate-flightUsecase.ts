import { UpdateFlightDTO, FlightDetailsDTO } from "@application/dtos/flight-dtos";

export interface IUpdateFlightUseCase {
  execute(
    providerId: string,
    flightId: string,
    data: UpdateFlightDTO
  ): Promise<FlightDetailsDTO>;
}