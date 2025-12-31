import {
  FlightDetailsDTO,
 
} from "@application/dtos/flight-dtos";


export interface IGetProviderFlightsUseCase {
  execute(providerId: string): Promise<FlightDetailsDTO[]>;
}