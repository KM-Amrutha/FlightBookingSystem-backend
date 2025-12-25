import {
  CreateFlightDTO,
  FlightDetailsDTO,

} from "@application/dtos/flight-dtos";

export interface ICreateFlightUseCase {
  execute(providerId: string, data: CreateFlightDTO): Promise<FlightDetailsDTO>;
}