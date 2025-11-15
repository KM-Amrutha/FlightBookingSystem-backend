
export interface ICheckUserBlockStatusUseCase {
  execute(_id: string): Promise<boolean>;
}