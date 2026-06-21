import {
  IAircraftRepository,
  IProviderRepository,
} from "@di/file-imports-index";
import { UpdateAircraftStatusDTO, AircraftDetailsDTO } from "@application/dtos/aircraft-dtos";
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
import { IUpdateAircraftStatusUseCase } from "@di/file-imports-index";
import { AircraftMapper } from "@application/mappers/aircraftMapper";

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

  private validateStatusTransition(currentStatus: string, newStatus: string): void {
    if (currentStatus === newStatus) {
      throw new ConflictError(
        AIRCRAFT_MESSAGES.ALREADY_IN_STATUS(newStatus)                        
      );
    }

    const validTransitions: Record<string, string[]> = {
      active: ["maintenance", "inactive"],
      maintenance: ["active", "inactive"],
      inactive: ["active", "maintenance"],
    };

    const allowedStatuses = validTransitions[currentStatus];
    if (!allowedStatuses || !allowedStatuses.includes(newStatus)) {
      throw new ConflictError(
        AIRCRAFT_MESSAGES.INVALID_STATUS_TRANSITION(currentStatus, newStatus)  
      );
    }
  }

  private async checkUpcomingFlightsForStatusChange(
    aircraftId: string,
    newStatus: string
  ): Promise<void> {
    if (newStatus === "inactive" || newStatus === "maintenance") {
      // TODO: Implement when FlightSchedule module is ready
    }
  }

  
  private validateAircraftAvailability(
    aircraft: Awaited<ReturnType<IAircraftRepository["getAircraftById"]>>,
    newStatus: string
  ): void {
    if (!aircraft) return;

    if (newStatus === "active") {
      const now = new Date();
      const availableFrom = new Date(aircraft.availableFrom);
      if (availableFrom > now) {
        throw new ConflictError(
          AIRCRAFT_MESSAGES.CANNOT_ACTIVATE_NOT_YET_AVAILABLE(              
            availableFrom.toISOString()
          )
        );
      }
    }
  }

  private async verifyProviderCanActivateAircraft(
    providerId: string,
    newStatus: string
  ): Promise<void> {
    if (newStatus === "active") {
      const { aircrafts } = await this._aircraftRepository.findByProviderId(providerId);


      const activeCount = aircrafts.filter((a) => a.status === "active").length;

      if (activeCount >= 50) {
        throw new ConflictError(AIRCRAFT_MESSAGES.MAX_ACTIVE_AIRCRAFT_REACHED); 
      }
    }
  }

  private validateStatusValue(status: string): void {
    const validStatuses = ["active", "inactive", "maintenance"];
    if (!validStatuses.includes(status)) {
      throw new validationError(
        AIRCRAFT_MESSAGES.INVALID_STATUS_VALUE(validStatuses)                  
      );
    }
  }

  async execute(
    providerId: string,
    data: UpdateAircraftStatusDTO
  ): Promise<AircraftDetailsDTO> {
    if (!providerId || !data.aircraftId || !data.status) {
      throw new validationError(APPLICATION_MESSAGES.ALL_FIELDS_ARE_REQUIRED);
    }

    if (!data.aircraftId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new validationError(AIRCRAFT_MESSAGES.INVALID_AIRCRAFT_ID_FORMAT);
    }

    this.validateStatusValue(data.status);

    const [aircraft] = await Promise.all([
      this.validateOwnership(data.aircraftId, providerId),
      this.validateProvider(providerId),
      this.verifyProviderCanActivateAircraft(providerId, data.status),
    ]);

    this.validateStatusTransition(aircraft.status, data.status);
    this.validateAircraftAvailability(aircraft, data.status);

    await this.checkUpcomingFlightsForStatusChange(data.aircraftId, data.status);

    const updatedAircraft = await this._aircraftRepository.updateAircraft(
      data.aircraftId,
      { status: data.status }
    );
    if (!updatedAircraft) throw new NotFoundError(AIRCRAFT_MESSAGES.NOT_FOUND);

  
    return AircraftMapper.toAircraftDTO(updatedAircraft);
  }
}