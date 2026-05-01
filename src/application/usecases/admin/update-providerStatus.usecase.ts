import {inject,injectable} from "inversify";
import {TYPES_REPOSITORIES} from "@di/types-repositories";
import {IProviderRepository} from "@domain/interfaces/IProviderRepository";
import { IUpdateProviderStatusUseCase } from "@application/interfaces/usecase/admin/IUpdate-providerStatus.usecase";

@injectable()
export class UpdateProviderStatusUseCase implements IUpdateProviderStatusUseCase {
    constructor(
        @inject(TYPES_REPOSITORIES.ProviderRepository)
        private _providerRepository: IProviderRepository
    ) {}

async execute(providerId: string, isActive: boolean): Promise<void> {
    
      
      const success = await this._providerRepository.updateActiveStatus(providerId, isActive);

      if (!success) {
        throw new Error("Provider not found");
      }
   
  }    

    
}