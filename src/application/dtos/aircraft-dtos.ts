
export interface CreateAircraftDTO {
  providerId: string;
  aircraftType: string;
  aircraftName: string;
  manufacturer: string;
  buildYear: number;
  seatCapacity: number;
  seatLayoutType: string;
  flyingRangeKm: number;
  engineCount: number;
  lavatoryCount: number;
  baseStationId: string;
  currentLocationId: string;
  availableFrom: Date;
  status: "active" | "inactive" | "maintenance";
}

export interface UpdateAircraftDTO {
  aircraftName?: string;
  seatCapacity?: number;
  flyingRangeKm?: number;
  engineCount?: number;
  lavatoryCount?: number;
  currentLocationId?: string;
  availableFrom?: Date;
  status?: "active" | "inactive" | "maintenance";
}

export interface UpdateAircraftStatusDTO {
  aircraftId: string;
  status: "active" | "inactive" | "maintenance";
}

export interface UpdateAircraftLocationDTO {
  aircraftId: string;
  currentLocationId: string;
}

export interface AircraftDetailsDTO {
  _id: string;
  providerId: string;
  aircraftType: string;
  aircraftName: string;
  manufacturer: string;
  buildYear: number;
  seatCapacity: number;
  seatLayoutType: string;
  flyingRangeKm: number;
  engineCount: number;
  lavatoryCount: number;
  baseStationId: string;
  currentLocationId: string;
  availableFrom: Date;
  status: "active" | "inactive" | "maintenance";
  createdAt: Date;
  updatedAt: Date;
  baseStation?: {
    _id: string;
    name: string;
    city: string;
    country: string;
  };
  currentLocation?: {
    _id: string;
    name: string;
    city: string;
    country: string;
  };
}
