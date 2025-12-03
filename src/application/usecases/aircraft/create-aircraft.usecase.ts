import { IAircraftRepository } from "@di/file-imports-index";
import { IProviderRepository } from "@domain/interfaces/IProviderRepository";
import { CreateAircraftDTO, AircraftDetailsDTO } from "@application/dtos/aircraft-dtos";
import { ApplicationStatus, AircraftStatus, AuthStatus } from "@shared/constants/index.constants";
import { validationError } from "@presentation/middlewares/error.middleware";
import { inject, injectable } from "inversify";
import { TYPES_REPOSITORIES,TYPES_AIRCRAFT_REPOSITORIES } from "@di/types-repositories";
import { ICreateAircraftUseCase } from "@di/file-imports-index";

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
      throw new validationError(ApplicationStatus.AllFieldsAreRequired);
    }

    if (data.seatCapacity <= 0) {
      throw new validationError(AircraftStatus.InvalidCapacity);
    }

    const currentYear = new Date().getFullYear();
    if (data.buildYear < 1900 || data.buildYear > currentYear) {
      throw new validationError(AircraftStatus.InvalidBuildYear);
    }

    const provider = await this._providerRepository.findById(data.providerId);
    if (!provider) {
      throw new validationError(AircraftStatus.ProviderNotFound);
    }

    const isProviderBlocked = await this._providerRepository.isProviderBlocked(data.providerId);
    if (isProviderBlocked) {
      throw new validationError(AuthStatus.AccountBlocked);
    }

    const existingAircrafts = await this._aircraftRepository.findByProviderId(data.providerId);
    const nameExists = existingAircrafts.some(
      aircraft => aircraft.aircraftName.toLowerCase() === data.aircraftName.toLowerCase()
    );
    
    if (nameExists) {
      throw new validationError(AircraftStatus.AlreadyExists);
    }

    try {
      return await this._aircraftRepository.createAircraft(data);
    } catch (error) {
       console.error("❌ ACTUAL REPOSITORY ERROR:", error);
       
      throw new validationError(AircraftStatus.CreationFailed);
    }
  }
}
