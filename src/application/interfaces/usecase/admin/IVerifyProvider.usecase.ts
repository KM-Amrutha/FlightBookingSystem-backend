export interface IVerifyProviderUseCase {
  execute(providerId: string): Promise<void>;
}
