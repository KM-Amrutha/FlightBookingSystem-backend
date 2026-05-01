import { SearchFlightsDTO, SearchFlightResponseDTO } from "@application/dtos/flight-dtos";

export interface ISearchFlightsUseCase {
  execute(data: SearchFlightsDTO): Promise<SearchFlightResponseDTO>;
}