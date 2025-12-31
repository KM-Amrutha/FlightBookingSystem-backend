import { IDestination } from "@domain/entities/destination.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";

export interface IDestinationRepository extends IBaseRepository<IDestination> {
  findByIataCode(iataCode: string): Promise<IDestination | null>;
  findByIcaoCode(icaoCode: string): Promise<IDestination | null>;
  searchDestinations(searchTerm: string): Promise<IDestination[]>;
  getActiveDestinations(): Promise<IDestination[]>;
  getDestinationsByCountry(countryCode: string): Promise<IDestination[]>;
}
