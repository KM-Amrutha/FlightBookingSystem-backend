import { 
  IAircraftRepository, 
  IProviderRepository,
  IDestinationRepository
} from "@di/file-imports-index";
import { UpdateAircraftLocationDTO, AircraftDetailsDTO } from "@application/dtos/aircraft-dtos";
import { AircraftStatus, AuthStatus, ApplicationStatus } from "@shared/constants/index.constants";
import { validationError, NotFoundError, ForbiddenError, ConflictError } from "@presentation/middlewares/error.middleware";
import { inject, injectable } from "inversify";
import { TYPES_REPOSITORIES, TYPES_AIRCRAFT_REPOSITORIES } from "@di/types-repositories";
import { IUpdateAircraftLocationUseCase } from "@di/file-imports-index";

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
      this._providerRepository.isProviderBlocked(providerId)
    ]);

    if (!provider) {
      throw new NotFoundError(AircraftStatus.ProviderNotFound);
    }

    if (isBlocked) {
      throw new ForbiddenError(AuthStatus.AccountBlocked);
    }

    if (!provider.isVerified) {
      throw new ForbiddenError(AuthStatus.AccountNotVerified);
    }
  }

  private async validateOwnership(
    aircraftId: string, 
    providerId: string
  ): Promise<AircraftDetailsDTO> {
    const aircraft = await this._aircraftRepository.getAircraftById(aircraftId);
    
    if (!aircraft) {
      throw new NotFoundError(AircraftStatus.NotFound);
    }

    if (aircraft.providerId !== providerId) {
      throw new ForbiddenError("You don't have permission to update this aircraft");
    }

    return aircraft;
  }

  private async validateDestination(destinationId: string): Promise<void> {
    const destination = await this._destinationRepository.findById(destinationId);
    
    if (!destination) {
      throw new NotFoundError(AircraftStatus.StationNotFound);
    }

    if (!destination.isActive) {
      throw new validationError("Selected destination is not active");
    }
  }

  private validateAircraftStatus(aircraft: AircraftDetailsDTO): void {
    if (aircraft.status === "maintenance") {
      throw new ConflictError(
        "Cannot change location for aircraft under maintenance. Complete maintenance first"
      );
    }

    if (aircraft.status === "inactive") {
      throw new ConflictError(
        "Cannot change location for inactive aircraft. Activate aircraft first"
      );
    }
  }

  private validateLocationChange(
    currentLocationId: string,
    newLocationId: string
  ): void {
    if (currentLocationId === newLocationId) {
      throw new ConflictError("Aircraft is already at this location");
    }
  }

  private async checkActiveFlights(aircraftId: string): Promise<void> {
    // TODO: Implement when FlightSchedule module is ready
    // const activeFlights = await this._flightScheduleRepository
    //   .getActiveFlightsByAircraftId(aircraftId);
    
    // if (activeFlights.length > 0) {
    //   throw new ConflictError(
    //     `Cannot change location. Aircraft has ${activeFlights.length} active flight(s). ` +
    //     `Wait for flights to complete or cancel them`
    //   );
    // }
  }

  private async checkUpcomingDepartures(
    aircraftId: string,
    newLocationId: string
  ): Promise<void> {
    // TODO: Implement when FlightSchedule module is ready
    // const upcomingFlights = await this._flightScheduleRepository
    //   .getUpcomingFlightsByAircraftId(aircraftId, 24); // Next 24 hours
    
    // if (upcomingFlights.length > 0) {
    //   // Check if any upcoming flight departs from different location
    //   const conflictingFlights = upcomingFlights.filter(
    //     flight => flight.departureAirportId !== newLocationId
    //   );
    
    //   if (conflictingFlights.length > 0) {
    //     throw new ConflictError(
    //       `Location conflict: ${conflictingFlights.length} upcoming flight(s) depart from different airport. ` +
    //       `Reschedule flights or choose correct location`
    //     );
    //   }
    // }
  }

  private async validateFlightConstraints(
    aircraftId: string,
    newLocationId: string
  ): Promise<void> {
    await Promise.all([
      this.checkActiveFlights(aircraftId),
      this.checkUpcomingDepartures(aircraftId, newLocationId)
    ]);
  }

  private async logLocationChange(
    aircraftId: string,
    oldLocationId: string,
    newLocationId: string,
    providerId: string
  ): Promise<void> {
    // TODO: Implement activity logging when AuditLog module is ready
    // await this._auditLogRepository.create({
    //   entityType: "aircraft",
    //   entityId: aircraftId,
    //   action: "location_change",
    //   performedBy: providerId,
    //   oldValue: oldLocationId,
    //   newValue: newLocationId,
    //   timestamp: new Date()
    // });
  }

  async execute(
    providerId: string, 
    data: UpdateAircraftLocationDTO
  ): Promise<AircraftDetailsDTO> {
    if (!providerId || !data.aircraftId || !data.currentLocationId) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }

    if (!data.aircraftId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new validationError("Invalid aircraft ID format");
    }

    if (!data.currentLocationId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new validationError("Invalid destination ID format");
    }

    const [aircraft] = await Promise.all([
      this.validateOwnership(data.aircraftId, providerId),
      this.validateProvider(providerId),
      this.validateDestination(data.currentLocationId)
    ]);

    this.validateAircraftStatus(aircraft);
    this.validateLocationChange(aircraft.currentLocationId, data.currentLocationId);

    await this.validateFlightConstraints(data.aircraftId, data.currentLocationId);

    try {
      const updatedAircraft = await this._aircraftRepository.updateAircraft(
        data.aircraftId,
        { currentLocationId: data.currentLocationId }
      );

      if (!updatedAircraft) {
        throw new NotFoundError(AircraftStatus.NotFound);
      }

      await this.logLocationChange(
        data.aircraftId,
        aircraft.currentLocationId,
        data.currentLocationId,
        providerId
      );

      return updatedAircraft;
    } catch (error) {
      if (
        error instanceof validationError || 
        error instanceof NotFoundError || 
        error instanceof ForbiddenError ||
        error instanceof ConflictError
      ) {
        throw error;
      }
      throw new validationError("Failed to update aircraft location");
    }
  }
}
