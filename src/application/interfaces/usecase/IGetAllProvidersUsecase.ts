import { Provider } from "@application/dtos/provider-dtos";

export interface IGetAllProvidersUseCase {
    execute (): Promise<Provider[]>;
}