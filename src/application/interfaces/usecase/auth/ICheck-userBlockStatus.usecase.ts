
export interface ICheckUserBlockStatusUseCase {
  execute(id: string): Promise<boolean>;
}