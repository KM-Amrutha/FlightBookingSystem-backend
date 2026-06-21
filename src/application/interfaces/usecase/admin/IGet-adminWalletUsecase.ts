import { AdminWalletResponseDTO } from "@application/dtos/wallet-dtos";

export interface IGetAdminWalletUseCase {
  execute(): Promise<AdminWalletResponseDTO>;
}