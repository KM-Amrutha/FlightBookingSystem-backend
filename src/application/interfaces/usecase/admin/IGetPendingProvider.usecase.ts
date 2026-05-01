import { Provider } from "@application/dtos/provider-dtos";

export interface IGetPendingProvidersUseCase {
    execute(): Promise<Provider[]>;
}