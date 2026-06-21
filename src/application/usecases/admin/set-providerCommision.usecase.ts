import { inject, injectable } from "inversify";
import { IProviderRepository } from "@domain/interfaces/IProviderRepository";
import { ISetProviderCommissionUseCase } from "@di/file-imports-index";
import { NotFoundError, validationError } from "@presentation/middlewares/error.middleware";
import { TYPES_REPOSITORIES } from "@di/types-repositories";

@injectable()
export class SetProviderCommissionUseCase implements ISetProviderCommissionUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.ProviderRepository)
    private readonly _providerRepository: IProviderRepository
  ) {}

  async execute(providerId: string, commissionRate: number): Promise<void> {
    if (commissionRate < 0 || commissionRate > 100) {
      throw new validationError("Commission rate must be between 0 and 100");
    }

    const provider = await this._providerRepository.getProviderDetailsById(providerId);
    if (!provider) throw new NotFoundError("Provider not found");

    await this._providerRepository.updateProvider(providerId, { commissionRate });
  }
}