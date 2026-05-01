export interface IUpdateProviderStatusUseCase {
  execute(providerId: string, isActive: boolean): Promise<void>;
}