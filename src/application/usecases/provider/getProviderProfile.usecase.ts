import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { IProviderRepository } from "@domain/interfaces/IProviderRepository";
import { Provider } from "@application/dtos/provider-dtos"
import { IGetProviderProfileUseCase } from "@application/interfaces/usecase/IGetProviderProfileUsecase";
import { validationError } from "@presentation/middlewares/error.middleware";

@injectable()
export class GetProviderProfileUseCase implements IGetProviderProfileUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.ProviderRepository)
    private _providerRepository: IProviderRepository
  ) {}

  async execute(providerId: string): Promise<Provider> {
    const provider = await this._providerRepository.getProviderDetailsById(providerId);
    
    if (!provider) {
      throw new validationError("Provider not found");
    }

    return {
      ...provider,
      role: "provider"
    } as Provider;
  }
}
