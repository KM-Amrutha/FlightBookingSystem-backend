import { FlightListDTO } from "@application/dtos/flight-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";

export interface IGetProviderFlightsUseCase {
  execute(
    providerId: string,
    page: number,
    limit: number
  ): Promise<{
    flightsList: FlightListDTO[];
    paginationData: PaginationDTO;
  }>;
}