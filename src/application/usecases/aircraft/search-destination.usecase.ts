import { IDestinationRepository } from "@di/file-imports-index";
import { validationError } from "@presentation/middlewares/error.middleware";
import { inject, injectable } from "inversify";
import { TYPES_AIRCRAFT_REPOSITORIES } from "@di/types-repositories";
import { ISearchDestinationsUseCase } from "@di/file-imports-index";
import { DestinationMapper } from "@application/mappers/destinationMapper";
import { DestinationDTO } from "@application/dtos/destination-dtos";

@injectable()
export class SearchDestinationsUseCase implements ISearchDestinationsUseCase {
  constructor(
    @inject(TYPES_AIRCRAFT_REPOSITORIES.DestionationRepository)
    private _destinationRepository: IDestinationRepository
  ) {}

  async execute(searchTerm: string): Promise<DestinationDTO[]> {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw new validationError("Search term must be at least 2 characters");
    }

    const trimmedSearch = searchTerm.trim();

      const destinations = await this._destinationRepository.searchDestinations(trimmedSearch);
      return DestinationMapper.toDestinationDTOs(destinations);  
   
  }
}
