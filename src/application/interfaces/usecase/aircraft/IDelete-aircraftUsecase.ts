import { AircraftDetailsDTO } from "@application/dtos/aircraft-dtos";

export interface IDeleteAircraftUseCase {
  execute(aircraftId: string, providerId: string): Promise<AircraftDetailsDTO>;
}
