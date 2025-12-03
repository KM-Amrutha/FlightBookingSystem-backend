import { IDestination } from "@domain/entities/destination.entity";

export interface ISearchDestinationsUseCase {
  execute(searchTerm: string): Promise<IDestination[]>;
}
