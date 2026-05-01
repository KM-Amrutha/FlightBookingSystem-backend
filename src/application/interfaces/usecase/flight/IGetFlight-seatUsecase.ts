import { FlightSeatMapDTO } from "@application/dtos/flightSeat-dtos";

export interface IGetFlightSeatsUseCase {
  execute(flightId: string, requesterId: string, role: "provider" | "user"): 
  Promise<FlightSeatMapDTO[]>;
}