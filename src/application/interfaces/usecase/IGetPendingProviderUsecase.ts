import { IProvider } from "@domain/entities/provider.entity";

export interface IGetPendingProvidersUseCase {
  execute(): Promise<IProvider[]>;
}