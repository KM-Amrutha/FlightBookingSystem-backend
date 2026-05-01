import {inject,injectable} from "inversify";
import {TYPES_REPOSITORIES} from "@di/types-repositories";
import {IProviderRepository} from "@domain/interfaces/IProviderRepository";
import {Provider} from "@application/dtos/provider-dtos";
import {PaginationDTO} from "@application/dtos/utility-dtos";
import {IGetAllProvidersUseCase} from "@application/interfaces/usecase/admin/IGetAllProviders.usecase";
import {PROVIDER_MESSAGES} from "@shared/constants/providerMessages/provider.messages";     
import {BaseQueryDTO} from "@application/dtos/query-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import { ProviderMapper } from "@application/mappers/providerMapper";

@injectable()
export class GetAllProvidersUseCase implements IGetAllProvidersUseCase {
    constructor(
        @inject(TYPES_REPOSITORIES.ProviderRepository)
        private _providerRepository: IProviderRepository
    ) {}    

    async execute({page, limit, search, filters}: BaseQueryDTO): Promise<{
        providersList: Provider[];
        paginationData: PaginationDTO;
    }> {
        
            const {providers, totalPages,currentPage} = await this._providerRepository.getAllProviders(page, limit, search, filters);

      if(!providers || providers.length === 0) {  
        throw new validationError(PROVIDER_MESSAGES.FAILED_TO_RETRIEVE_PROVIDERS_LIST);
      }
return {
      providersList: ProviderMapper.toProviderDTOs(providers),
      paginationData: { totalPages, currentPage },
}

       
    }
    }