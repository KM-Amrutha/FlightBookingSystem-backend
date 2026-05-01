import { IAircraftRepository } from "@di/file-imports-index";
import { IProviderRepository } from "@domain/interfaces/IProviderRepository";
import { CreateAircraftDTO, AircraftDetailsDTO } from "@application/dtos/aircraft-dtos";
import { APPLICATION_MESSAGES, AIRCRAFT_MESSAGES, AUTH_MESSAGES } from "@shared/constants/index.constants";
import { validationError } from "@presentation/middlewares/error.middleware";
import { inject, injectable } from "inversify";
import { TYPES_REPOSITORIES,TYPES_AIRCRAFT_REPOSITORIES } from "@di/types-repositories";
import { ICreateAircraftUseCase } from "@di/file-imports-index";
import { AircraftMapper } from "@application/mappers/aircraftMapper"
import { IAircraft } from "@domain/entities/aircraft.entity";

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
    if (!provider) {
      throw new validationError(AIRCRAFT_MESSAGES.PROVIDER_NOT_FOUND);
    }

if (!provider.adminApproval || provider.profileStatus !== 'approved') {
  throw new validationError("Your profile must be approved by admin before adding aircraft");
}
    
    if (provider.licenseExpiryDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiryDate = new Date(provider.licenseExpiryDate);
  expiryDate.setHours(0, 0, 0, 0);
  if (expiryDate < today) {
    throw new validationError("Your license has expired. Please renew it before adding aircraft.");
  }
}

    const isProviderBlocked = await this._providerRepository.isProviderBlocked(data.providerId);
    if (isProviderBlocked) {
      throw new validationError(AUTH_MESSAGES.ACCOUNT_BLOCKED);
    }
const { aircrafts: existingAircrafts } = await this._aircraftRepository.findByProviderId(data.providerId);
const nameExists = existingAircrafts.some(
  (aircraft: IAircraft) => aircraft.aircraftName.toLowerCase() === data.aircraftName.toLowerCase()
);
    
    if (nameExists) {
      throw new validationError(AIRCRAFT_MESSAGES.ALREADY_EXISTS);
    }

   const aircraft = await this._aircraftRepository.createAircraft(data);
   return AircraftMapper.toAircraftDTO(aircraft);
  }
}
