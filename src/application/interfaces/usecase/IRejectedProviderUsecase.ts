export interface IRejectProviderUseCase {
  execute(providerId: string): Promise<void>;
}
