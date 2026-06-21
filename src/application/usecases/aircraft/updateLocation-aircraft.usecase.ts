import {
  IAircraftRepository,
  IProviderRepository,
  IDestinationRepository,
} from "@di/file-imports-index";
import { UpdateAircraftLocationDTO, AircraftDetailsDTO } from "@application/dtos/aircraft-dtos";
import {
  AIRCRAFT_MESSAGES,
  AUTH_MESSAGES,
  APPLICATION_MESSAGES,
} from "@shared/constants/index.constants";
import {
  validationError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
} from "@presentation/middlewares/error.middleware";
import { inject, injectable } from "inversify";
import { TYPES_REPOSITORIES, TYPES_AIRCRAFT_REPOSITORIES } from "@di/types-repositories";
import { IUpdateAircraftLocationUseCase } from "@di/file-imports-index";
import { AircraftMapper } from "@application/mappers/aircraftMapper";

@injectable()
export class UpdateAircraftLocationUseCase implements IUpdateAircraftLocationUseCase {
  constructor(
    @inject(TYPES_AIRCRAFT_REPOSITORIES.AircraftRepository)
    private _aircraftRepository: IAircraftRepository,
    @inject(TYPES_REPOSITORIES.ProviderRepository)
    private _providerRepository: IProviderRepository,
    @inject(TYPES_AIRCRAFT_REPOSITORIES.DestionationRepository)
    private _destinationRepository: IDestinationRepository
  ) {}

  private async validateProvider(providerId: string): Promise<void> {
    const [provider, isBlocked] = await Promise.all([
      this._providerRepository.getProviderDetailsById(providerId),
      this._providerRepository.isProviderBlocked(providerId),
    ]);
    if (!provider) throw new NotFoundError(AIRCRAFT_MESSAGES.PROVIDER_NOT_FOUND);
    if (isBlocked) throw new ForbiddenError(AUTH_MESSAGES.ACCOUNT_BLOCKED);
    if (!provider.isVerified) throw new ForbiddenError(AUTH_MESSAGES.ACCOUNT_NOT_VERIFIED);
  }

  
  private async validateOwnership(aircraftId: string, providerId: string) {
    const aircraft = await this._aircraftRepository.getAircraftById(aircraftId);
    if (!aircraft) throw new NotFoundError(AIRCRAFT_MESSAGES.NOT_FOUND);
    if (aircraft.providerId !== providerId) {
      throw new ForbiddenError(AIRCRAFT_MESSAGES.UPDATE_FORBIDDEN);            
    }
    return aircraft;
  }

  private async validateDestination(destinationId: string): Promise<void> {
    const destination = await this._destinationRepository.findById(destinationId);
    if (!destination) throw new NotFoundError(AIRCRAFT_MESSAGES.STATION_NOT_FOUND);
    if (!destination.isActive) {
      throw new validationError(AIRCRAFT_MESSAGES.DESTINATION_NOT_ACTIVE);     
    }
  }


  private validateAircraftStatus(
    aircraft: Awaited<ReturnType<IAircraftRepository["getAircraftById"]>>
  ): void {
    if (!aircraft) return;

    if (aircraft.status === "maintenance") {
      throw new ConflictError(AIRCRAFT_MESSAGES.LOCATION_CHANGE_MAINTENANCE);   
    }

    if (aircraft.status === "inactive") {
      throw new ConflictError(AIRCRAFT_MESSAGES.LOCATION_CHANGE_INACTIVE);      
    }
  }

  private validateLocationChange(
    currentLocationId: string,
    newLocationId: string
  ): void {
    if (currentLocationId === newLocationId) {
      throw new ConflictError(AIRCRAFT_MESSAGES.ALREADY_AT_LOCATION);       
    }
  }

  private async checkActiveFlights(aircraftId: string): Promise<void> {
    // TODO: Implement when FlightSchedule module is ready
  }

  private async checkUpcomingDepartures(
    aircraftId: string,
    newLocationId: string
  ): Promise<void> {
    // TODO: Implement when FlightSchedule module is ready
  }

  private async validateFlightConstraints(
    aircraftId: string,
    newLocationId: string
  ): Promise<void> {
    await Promise.all([
      this.checkActiveFlights(aircraftId),
      this.checkUpcomingDepartures(aircraftId, newLocationId),
    ]);
  }

  private async logLocationChange(
    aircraftId: string,
    oldLocationId: string,
    newLocationId: string,
    providerId: string
  ): Promise<void> {
    // TODO: Implement when AuditLog module is ready
  }

  async execute(
    providerId: string,
    data: UpdateAircraftLocationDTO
  ): Promise<AircraftDetailsDTO> {
    if (!providerId || !data.aircraftId || !data.currentLocationId) {
      throw new validationError(APPLICATION_MESSAGES.ALL_FIELDS_ARE_REQUIRED);
    }

    if (!data.aircraftId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new validationError(AIRCRAFT_MESSAGES.INVALID_AIRCRAFT_ID_FORMAT);  
    }

    if (!data.currentLocationId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new validationError(AIRCRAFT_MESSAGES.INVALID_DESTINATION_ID_FORMAT); 
    }

    const [aircraft] = await Promise.all([
      this.validateOwnership(data.aircraftId, providerId),
      this.validateProvider(providerId),
      this.validateDestination(data.currentLocationId),
    ]);

    this.validateAircraftStatus(aircraft);

    this.validateLocationChange(
      aircraft.currentLocationId,
      data.currentLocationId
    );

    await this.validateFlightConstraints(data.aircraftId, data.currentLocationId);

    const updatedAircraft = await this._aircraftRepository.updateAircraft(
      data.aircraftId,
      { currentLocationId: data.currentLocationId }
    );
    if (!updatedAircraft) throw new NotFoundError(AIRCRAFT_MESSAGES.NOT_FOUND);

    await this.logLocationChange(
      data.aircraftId,
      aircraft.currentLocationId,
      data.currentLocationId,
      providerId
    );

    
    return AircraftMapper.toAircraftDTO(updatedAircraft);
  }
}