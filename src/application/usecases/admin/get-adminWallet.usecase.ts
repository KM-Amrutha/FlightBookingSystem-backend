import { inject, injectable } from "inversify";
import { IAdminWalletRepository } from "@domain/interfaces/IAdminWalletRepository";
import { IGetAdminWalletUseCase } from "@di/file-imports-index";
import { AdminWalletResponseDTO } from "@application/dtos/wallet-dtos";
import { AdminWalletMapper } from "@application/mappers/adminWalletMapper";
import { TYPES_BOOKING_REPOSITORIES } from "@di/types-repositories";

@injectable()
export class GetAdminWalletUseCase implements IGetAdminWalletUseCase {
  constructor(
    @inject(TYPES_BOOKING_REPOSITORIES.AdminWalletRepository)
    private readonly _adminWalletRepository: IAdminWalletRepository
  ) {}

  async execute(): Promise<AdminWalletResponseDTO> {
    let wallet = await this._adminWalletRepository.getAdminWallet();

    if (!wallet) {
      wallet = await this._adminWalletRepository.creditWallet(
  {
    transactionId: "init",
    type: "credit",
    amount: 0,
    description: "Wallet initialized",
    commissionRate: 0,
    createdAt: new Date(),
  },
  0
);
    }

    return AdminWalletMapper.toAdminWalletResponseDTO(wallet);
  }
}