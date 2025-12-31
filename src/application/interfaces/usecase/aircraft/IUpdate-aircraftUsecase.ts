import { UpdateAircraftDTO,
   AircraftDetailsDTO } from "@application/dtos/aircraft-dtos";

export interface IUpdateAircraftUseCase {
  execute(aircraftId: string, providerId: string, data: UpdateAircraftDTO): Promise<AircraftDetailsDTO>;
}
