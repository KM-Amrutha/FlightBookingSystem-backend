export interface ISetProviderCommissionUseCase {
  execute(providerId: string, commissionRate: number): Promise<void>;
}