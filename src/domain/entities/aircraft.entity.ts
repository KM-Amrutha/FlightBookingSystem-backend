export interface IAircraft {
  id: string;
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
    id: string;
    name: string;
    municipality: string;
    isoCountry: string;
  };
  currentLocation?: {
    id: string;
    name: string;
    municipality: string;
    isoCountry: string;
  };
}


