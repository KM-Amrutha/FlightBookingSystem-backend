import { inject, injectable } from "inversify";
import { IAircraftRepository } from "@domain/interfaces/IAircraftRepository";
import { IDestinationRepository } from "@domain/interfaces/IDestinationRepository";
import { validationError } from "@presentation/middlewares/error.middleware";
import { TYPES_AIRCRAFT_REPOSITORIES } from "@di/types-repositories";
import { IAvailableAircraftsForScheduleUsecase } from "@di/file-imports-index";
import { AircraftDetailsDTO } from "@application/dtos/aircraft-dtos";

@injectable()
export class AvailableAircraftsForScheduleUseCase implements
 IAvailableAircraftsForScheduleUsecase {
  constructor(
    @inject(TYPES_AIRCRAFT_REPOSITORIES.AircraftRepository)
    private _aircraftRepository: IAircraftRepository,
    @inject(TYPES_AIRCRAFT_REPOSITORIES.DestionationRepository)
    private _destinationRepository: IDestinationRepository
  ) {}

  async execute(
    providerId: string,
    departureDestinationId: string,
    departureTimeIso: string
  ): Promise<AircraftDetailsDTO[]> {
    if (!providerId || !departureDestinationId || !departureTimeIso) {
      throw new validationError("All fields are required for availability check");
    }

    const departureTime = new Date(departureTimeIso);
    if (isNaN(departureTime.getTime())) {
      throw new validationError("Invalid departure time");
    }

    // ensure departure destination exists (optional but clean)
    const depDest = await this._destinationRepository.findById(departureDestinationId);
    if (!depDest || !depDest.isActive) {
      throw new validationError("Invalid departure destination");
    }

    
    const activeAvailable = await this._aircraftRepository.availableAircraftsForSchedule(departureTime);

    const result = activeAvailable.filter(a => {
      return (
        a.providerId === providerId &&
        a.currentLocationId === departureDestinationId
      );
    });

    return result;
  }
}
