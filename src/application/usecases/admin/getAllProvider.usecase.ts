import {inject,injectable} from "inversify";
import {TYPES_REPOSITORIES} from "@di/types-repositories";
import {IProviderRepository} from "@domain/interfaces/IProviderRepository";
import {Provider} from "@application/dtos/provider-dtos";
import {IGetAllProvidersUseCase} from "@application/interfaces/usecase/IGetAllProvidersUsecase";

@injectable()
export class GetAllProvidersUseCase implements IGetAllProvidersUseCase {
    constructor(
        @inject(TYPES_REPOSITORIES.ProviderRepository)
        private _providerRepository: IProviderRepository
    ) {}    

    async execute(): Promise<Provider[]> {
        try{
        const providers = await this._providerRepository.getAllProviders();
      
        return providers.map(provider => ({
            ...provider,
            role: "provider"
        } as Provider));

    }    catch(error){
        console.error("❌ ACTUAL REPOSITORY ERROR:", error);
        throw new Error("Failed to retrieve providers");
    }

}

}