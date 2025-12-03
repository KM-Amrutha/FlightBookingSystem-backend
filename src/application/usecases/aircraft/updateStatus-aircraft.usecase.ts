import { 
  IAircraftRepository, 
  IProviderRepository 
} from "@di/file-imports-index";
import { UpdateAircraftStatusDTO, AircraftDetailsDTO } from "@application/dtos/aircraft-dtos";
import { AircraftStatus, AuthStatus, ApplicationStatus } from "@shared/constants/index.constants";
import { validationError, NotFoundError, ForbiddenError, ConflictError } from "@presentation/middlewares/error.middleware";
import { inject, injectable } from "inversify";
import { TYPES_REPOSITORIES, TYPES_AIRCRAFT_REPOSITORIES } from "@di/types-repositories";
import { IUpdateAircraftStatusUseCase } from "@di/file-imports-index";

@injectable()
export class UpdateAircraftStatusUseCase implements IUpdateAircraftStatusUseCase {
  constructor(
    @inject(TYPES_AIRCRAFT_REPOSITORIES.AircraftRepository)
    private _aircraftRepository: IAircraftRepository,
    @inject(TYPES_REPOSITORIES.ProviderRepository)
    private _providerRepository: IProviderRepository
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

  private validateStatusTransition(
    currentStatus: string, 
    newStatus: string
  ): void {
    if (currentStatus === newStatus) {
      throw new ConflictError(`Aircraft is already in ${newStatus} status`);
    }

    // Define valid status transitions
    const validTransitions: Record<string, string[]> = {
      active: ["maintenance", "inactive"],
      maintenance: ["active", "inactive"],
      inactive: ["active", "maintenance"]
    };

    const allowedStatuses = validTransitions[currentStatus];
    if (!allowedStatuses || !allowedStatuses.includes(newStatus)) {
      throw new ConflictError(
        `Invalid status transition from ${currentStatus} to ${newStatus}`
      );
    }
  }

  private async checkUpcomingFlightsForStatusChange(
    aircraftId: string,
    newStatus: string
  ): Promise<void> {
    if (newStatus === "inactive" || newStatus === "maintenance") {
      // TODO: Implement when FlightSchedule module is ready
      // const upcomingFlights = await this._flightScheduleRepository
      //   .getUpcomingFlightsByAircraftId(aircraftId);
      
      // if (upcomingFlights.length > 0) {
      //   throw new ConflictError(
      //     `Cannot set aircraft to ${newStatus}. ` +
      //     `${upcomingFlights.length} upcoming flight(s) scheduled. ` +
      //     `Cancel or reassign flights first`
      //   );
      // }
    }
  }

  private validateAircraftAvailability(
    aircraft: AircraftDetailsDTO,
    newStatus: string
  ): void {
    if (newStatus === "active") {
      const now = new Date();
      const availableFrom = new Date(aircraft.availableFrom);

      if (availableFrom > now) {
        throw new ConflictError(
          `Cannot activate aircraft. Available from ${availableFrom.toISOString()}`
        );
      }
    }
  }

  private async verifyProviderCanActivateAircraft(
    providerId: string,
    newStatus: string
  ): Promise<void> {
    if (newStatus === "active") {
      const activeAircrafts = await this._aircraftRepository.findByProviderId(providerId);
      const activeCount = activeAircrafts.filter(a => a.status === "active").length;

      // Business rule: Provider can have max 50 active aircrafts
      if (activeCount >= 50) {
        throw new ConflictError(
          "Maximum active aircraft limit (50) reached. Deactivate another aircraft first"
        );
      }
    }
  }

  private validateStatusValue(status: string): void {
    const validStatuses = ["active", "inactive", "maintenance"];
    if (!validStatuses.includes(status)) {
      throw new validationError(
        `Invalid status. Must be one of: ${validStatuses.join(", ")}`
      );
    }
  }

  async execute(
    providerId: string, 
    data: UpdateAircraftStatusDTO
  ): Promise<AircraftDetailsDTO> {
    if (!providerId || !data.aircraftId || !data.status) {
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }

    if (!data.aircraftId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new validationError("Invalid aircraft ID format");
    }

    this.validateStatusValue(data.status);

    const [aircraft] = await Promise.all([
      this.validateOwnership(data.aircraftId, providerId),
      this.validateProvider(providerId),
      this.verifyProviderCanActivateAircraft(providerId, data.status)
    ]);

    this.validateStatusTransition(aircraft.status, data.status);
    this.validateAircraftAvailability(aircraft, data.status);

    await this.checkUpcomingFlightsForStatusChange(data.aircraftId, data.status);

    try {
      const updatedAircraft = await this._aircraftRepository.updateAircraft(
        data.aircraftId,
        { status: data.status }
      );

      if (!updatedAircraft) {
        throw new NotFoundError(AircraftStatus.NotFound);
      }

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
      throw new validationError("Failed to update aircraft status");
    }
  }
}
