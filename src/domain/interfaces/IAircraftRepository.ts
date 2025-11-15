import { IAircraft } from "@domain/entities/aircraft.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";
import {
  CreateAircraftDTO,
  UpdateAircraftDTO,
  UpdateAircraftStatusDTO,
  UpdateAircraftLocationDTO,
  AircraftDetailsDTO
} from "@application/dtos/aircraft-dtos";

export interface IAircraftRepository extends IBaseRepository<IAircraft> {
  createAircraft(data: CreateAircraftDTO): Promise<AircraftDetailsDTO>;
  updateAircraft(aircraftId: string, data: UpdateAircraftDTO): Promise<AircraftDetailsDTO | null>;
  getAircraftById(aircraftId: string): Promise<AircraftDetailsDTO | null>;
  getAircraftsByProvider(providerId: string): Promise<AircraftDetailsDTO[]>;
  getAllAircrafts(): Promise<AircraftDetailsDTO[]>;
  getActiveAircrafts(): Promise<AircraftDetailsDTO[]>;
  updateStatus(data: UpdateAircraftStatusDTO): Promise<boolean>;
  updateLocation(data: UpdateAircraftLocationDTO): Promise<boolean>;
  deleteAircraft(aircraftId: string): Promise<boolean>;
  isAircraftActive(aircraftId: string): Promise<boolean>;
  findByProviderId(providerId: string): Promise<IAircraft[]>;
  findByStatus(status: "active" | "inactive" | "maintenance"): Promise<IAircraft[]>;
  findAvailableAircrafts(fromDate: Date): Promise<IAircraft[]>;
  findByType(aircraftType: string): Promise<IAircraft[]>;
  getAircraftDetails(aircraftId: string): Promise<IAircraft | null>;
}
