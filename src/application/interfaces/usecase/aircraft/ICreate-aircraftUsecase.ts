import { CreateAircraftDTO,
    AircraftDetailsDTO,
} from "@application/dtos/aircraft-dtos";



export interface ICreateAircraftUseCase {
  execute(data: CreateAircraftDTO): Promise<AircraftDetailsDTO>;
}
