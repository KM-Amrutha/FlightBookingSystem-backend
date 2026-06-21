import { IAircraft } from "@domain/entities/aircraft.entity";
import { AircraftDetailsDTO } from "@application/dtos/aircraft-dtos";

export class AircraftMapper {

  static toAircraftDTO(aircraft: IAircraft): AircraftDetailsDTO {
    return {
      id: aircraft.id,                            
      providerId: aircraft.providerId,
      aircraftType: aircraft.aircraftType,
      aircraftName: aircraft.aircraftName,
      manufacturer: aircraft.manufacturer,
      buildYear: aircraft.buildYear,
      seatCapacity: aircraft.seatCapacity,
      flyingRangeKm: aircraft.flyingRangeKm,
      engineCount: aircraft.engineCount,
      lavatoryCount: aircraft.lavatoryCount,
      availableFrom: aircraft.availableFrom
        ? aircraft.availableFrom.toISOString()
        : aircraft.availableFrom,                
      baseStationId: aircraft.baseStationId,
      currentLocationId: aircraft.currentLocationId,
      status: aircraft.status,
      createdAt: aircraft.createdAt,  
      updatedAt: aircraft.updatedAt,  
      ...(aircraft.baseStation && {
        baseStation: {
          id: aircraft.baseStation.id,           
          name: aircraft.baseStation.name,
          city: aircraft.baseStation.municipality, 
          country: aircraft.baseStation.isoCountry,
        },
      }),
      ...(aircraft.currentLocation && {
        currentLocation: {
          id: aircraft.currentLocation.id,      
          name: aircraft.currentLocation.name,
          city: aircraft.currentLocation.municipality,
          country: aircraft.currentLocation.isoCountry,
        },
      }),
    };
  }

  static toAircraftDTOs(aircrafts: IAircraft[]): AircraftDetailsDTO[] {
    return aircrafts.map((aircraft) => this.toAircraftDTO(aircraft));
  }

  static toAircraftResponse(aircraft: IAircraft) {
    return {
      aircraft: this.toAircraftDTO(aircraft),
    };
  }
}