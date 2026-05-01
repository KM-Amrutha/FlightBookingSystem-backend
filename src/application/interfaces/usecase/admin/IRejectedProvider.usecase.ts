export interface IRejectProviderUseCase {
  execute(providerId: string, reason: string): Promise<void>;
}