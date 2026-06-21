import { IAircraftRepository, IProviderRepository } from "@di/file-imports-index"; // ✅ both from DI
import { CreateAircraftDTO, AircraftDetailsDTO } from "@application/dtos/aircraft-dtos";
import {
  APPLICATION_MESSAGES,
  AIRCRAFT_MESSAGES,
  AUTH_MESSAGES,
  PROVIDER_MESSAGES,
} from "@shared/constants/index.constants";
import { validationError, NotFoundError, ForbiddenError } from "@presentation/middlewares/error.middleware";
import { inject, injectable } from "inversify";
import { TYPES_REPOSITORIES, TYPES_AIRCRAFT_REPOSITORIES } from "@di/types-repositories";
import { ICreateAircraftUseCase } from "@di/file-imports-index";
import { AircraftMapper } from "@application/mappers/aircraftMapper";

@injectable()
export class CreateAircraftUseCase implements ICreateAircraftUseCase {
  constructor(
    @inject(TYPES_AIRCRAFT_REPOSITORIES.AircraftRepository)
    private _aircraftRepository: IAircraftRepository,
    @inject(TYPES_REPOSITORIES.ProviderRepository)
    private _providerRepository: IProviderRepository
  ) {}

  async execute(data: CreateAircraftDTO): Promise<AircraftDetailsDTO> {
    if (!data.providerId) {
      throw new validationError(APPLICATION_MESSAGES.ALL_FIELDS_ARE_REQUIRED);
    }

    if (data.seatCapacity <= 0) {
      throw new validationError(AIRCRAFT_MESSAGES.INVALID_CAPACITY);
    }

    const currentYear = new Date().getFullYear();
    if (data.buildYear < 1900 || data.buildYear > currentYear) {
      throw new validationError(AIRCRAFT_MESSAGES.INVALID_BUILD_YEAR);
    }

    const provider = await this._providerRepository.findById(data.providerId);
    if (!provider) throw new NotFoundError(AIRCRAFT_MESSAGES.PROVIDER_NOT_FOUND);

    if (!provider.adminApproval || provider.profileStatus !== "approved") {
      throw new validationError(PROVIDER_MESSAGES.NOT_APPROVED);              
    }

    if (provider.licenseExpiryDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expiryDate = new Date(provider.licenseExpiryDate);
      expiryDate.setHours(0, 0, 0, 0);
      if (expiryDate < today) {
        throw new validationError(PROVIDER_MESSAGES.LICENSE_EXPIRED);         
      }
    }

    const isProviderBlocked = await this._providerRepository.isProviderBlocked(data.providerId);
    if (isProviderBlocked) throw new ForbiddenError(AUTH_MESSAGES.ACCOUNT_BLOCKED);

    const { aircrafts: existingAircrafts } = await this._aircraftRepository.findByProviderId(data.providerId);

    
    const nameExists = existingAircrafts.some(
      (aircraft) => aircraft.aircraftName.toLowerCase() === data.aircraftName.toLowerCase()
    );

    if (nameExists) throw new validationError(AIRCRAFT_MESSAGES.ALREADY_EXISTS);

    
    const aircraft = await this._aircraftRepository.createAircraft({
      providerId: data.providerId,
      aircraftType: data.aircraftType,
      aircraftName: data.aircraftName,
      manufacturer: data.manufacturer,
      buildYear: data.buildYear,
      seatCapacity: data.seatCapacity,
      flyingRangeKm: data.flyingRangeKm,
      engineCount: data.engineCount,
      lavatoryCount: data.lavatoryCount,
      baseStationId: data.baseStationId,
      currentLocationId: data.currentLocationId,
      availableFrom: new Date(data.availableFrom),
      status: data.status,
    });

    
    return AircraftMapper.toAircraftDTO(aircraft);
  }
}