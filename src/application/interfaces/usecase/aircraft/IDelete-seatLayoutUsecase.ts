export interface IDeleteSeatLayoutUseCase {
  execute(layoutId: string): Promise<void>;
}