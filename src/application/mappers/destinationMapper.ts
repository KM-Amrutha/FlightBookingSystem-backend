import { IDestination } from "@domain/entities/destination.entity";
import { DestinationDTO } from "@application/dtos/destination-dtos";

export class DestinationMapper {
  static toDestinationDTO(destination: IDestination): DestinationDTO {
    return {
      _id: destination.id,
      name: destination.name,
      iataCode: destination.iataCode,
      municipality: destination.municipality,
      isoCountry: destination.isoCountry,
      latitude: destination.latitude,
      longitude: destination.longitude,
      timezone: destination.timezone,
      isActive: destination.isActive,
      ...(destination.icaoCode && { icaoCode: destination.icaoCode }),
    };
  }

  static toDestinationDTOs(destinations: IDestination[]): DestinationDTO[] {
    return destinations.map((d) => this.toDestinationDTO(d));
  }
}