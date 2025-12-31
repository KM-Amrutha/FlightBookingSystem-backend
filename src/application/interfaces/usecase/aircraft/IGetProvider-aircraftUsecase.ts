import { AircraftDetailsDTO } from "@application/dtos/aircraft-dtos";

export interface IGetProviderAircraftsUseCase {
  execute(providerId: string): Promise<AircraftDetailsDTO[]>;
}
