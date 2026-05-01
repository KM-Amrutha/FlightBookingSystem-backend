import { DestinationDTO } from "@application/dtos/destination-dtos";

export interface ISearchDestinationsUseCase {
  execute(searchTerm: string): Promise<DestinationDTO[]>;
}
