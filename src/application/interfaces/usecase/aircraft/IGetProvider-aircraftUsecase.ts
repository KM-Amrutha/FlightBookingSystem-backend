import { AircraftDetailsDTO } from "@application/dtos/aircraft-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";

export interface IGetProviderAircraftsUseCase {
  execute(
    providerId: string,
    page?: number,
    limit?: number
  ): Promise<{
    aircraftsList: AircraftDetailsDTO[];
    paginationData: PaginationDTO;
  }>;
}