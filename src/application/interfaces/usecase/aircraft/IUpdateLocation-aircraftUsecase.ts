import { UpdateAircraftLocationDTO, AircraftDetailsDTO } from "@application/dtos/aircraft-dtos";

export interface IUpdateAircraftLocationUseCase {
  execute(providerId: string, data: UpdateAircraftLocationDTO): Promise<AircraftDetailsDTO>;
}
