import { UserWalletResponseDTO } from "@application/dtos/wallet-dtos";

export interface IGetUserWalletUseCase {
  execute(userId: string): Promise<UserWalletResponseDTO>;
}