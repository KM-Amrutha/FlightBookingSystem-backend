export interface IUpdateUserStatusUseCase {
  execute(userId: string, isActive: boolean): Promise<void>;
}