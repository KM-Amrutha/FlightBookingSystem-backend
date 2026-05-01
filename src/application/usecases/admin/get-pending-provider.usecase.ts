import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { IProviderRepository } from "@domain/interfaces/IProviderRepository";
import { IGetPendingProvidersUseCase } from "@application/interfaces/usecase/admin/IGetPendingProvider.usecase";
import { Provider } from "@application/dtos/provider-dtos";
import { ProviderMapper } from "@application/mappers/providerMapper";

@injectable()
export class GetPendingProvidersUseCase implements IGetPendingProvidersUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.ProviderRepository)
    private _providerRepository: IProviderRepository
  ) {}

  async execute(): Promise<Provider[]> {
    const providers = await this._providerRepository.findMany({ 
      isProfileComplete: true,
      profileStatus: 'pending',  
      isActive: true
    });
    return ProviderMapper.toProviderDTOs(providers)
  }
  
}