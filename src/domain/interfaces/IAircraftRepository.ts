import { IAircraft } from "@domain/entities/aircraft.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";

export interface IAircraftRepository extends IBaseRepository<IAircraft> {
  createAircraft(data: Partial<IAircraft>): Promise<IAircraft>;
  updateAircraft(aircraftId: string, data: Partial<IAircraft>): Promise<IAircraft | null>;
  getAircraftById(aircraftId: string): Promise<IAircraft | null>;
  getAircraftsByProvider(providerId: string): Promise<IAircraft[]>;
  getAllAircrafts(): Promise<IAircraft[]>;
  getActiveAircrafts(): Promise<IAircraft[]>;
  updateStatus(aircraftId: string, status: "active" | "inactive" | "maintenance"): Promise<boolean>;
  updateLocation(aircraftId: string, currentLocationId: string): Promise<boolean>;
  deleteAircraft(aircraftId: string): Promise<boolean>;
  isAircraftActive(aircraftId: string): Promise<boolean>;
  findByProviderId(providerId: string,page?:number,limit?:number): Promise<{
    aircrafts:IAircraft[];totalCount:number;currentPage:number;totalPages:number;}>;
  findByStatus(status: "active" | "inactive" | "maintenance"): Promise<IAircraft[]>;
  availableAircraftsForSchedule(fromDate: Date): Promise<IAircraft[]>;
  findByType(aircraftType: string): Promise<IAircraft[]>;
  getAircraftDetails(aircraftId: string): Promise<IAircraft | null>;
}