import { inject, injectable } from "inversify";
import { IProviderWalletRepository } from "@domain/interfaces/IProviderWalletRepository";
import { IGetProviderWalletUseCase } from "@di/file-imports-index";
import { ProviderWalletResponseDTO } from "@application/dtos/wallet-dtos";
import { ProviderWalletMapper } from "@application/mappers/providerWalletMapper";
import { NotFoundError } from "@presentation/middlewares/error.middleware";
import { TYPES_BOOKING_REPOSITORIES } from "@di/types-repositories";
import { WALLET_MESSAGES } from "@shared/constants/walletMessages/wallet.messages";

@injectable()
export class GetProviderWalletUseCase implements IGetProviderWalletUseCase {
  constructor(
    @inject(TYPES_BOOKING_REPOSITORIES.ProviderWalletRepository)
    private readonly _providerWalletRepository: IProviderWalletRepository
  ) {}

  async execute(providerId: string): Promise<ProviderWalletResponseDTO> {
    let wallet = await this._providerWalletRepository.getWalletByProviderId(providerId);

    // ── auto-create wallet on first access ────────────────────────────────
    if (!wallet) {
      wallet = await this._providerWalletRepository.createWallet(providerId);
    }

    if (!wallet) throw new NotFoundError(WALLET_MESSAGES.WALLET_NOT_FOUND);

    return ProviderWalletMapper.toProviderWalletResponseDTO(wallet);
  }
}