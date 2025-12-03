import { UpdateAircraftStatusDTO, AircraftDetailsDTO } from "@application/dtos/aircraft-dtos";

export interface IUpdateAircraftStatusUseCase {
  execute(providerId: string, data: UpdateAircraftStatusDTO): Promise<AircraftDetailsDTO>;
}
