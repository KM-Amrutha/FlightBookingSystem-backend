import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { IProviderRepository } from "@domain/interfaces/IProviderRepository";
import { IGetPendingProvidersUseCase } from "@application/interfaces/usecase/IGetPendingProviderUsecase";
import { IProvider } from "@domain/entities/provider.entity";

@injectable()
export class GetPendingProvidersUseCase implements IGetPendingProvidersUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.ProviderRepository)
    private _providerRepository: IProviderRepository
  ) {}

  async execute(): Promise<IProvider[]> {
    return await this._providerRepository.findMany({ 
      isVerified: true,
      adminApproval: false,
      isActive: true 
    });
  }
}
