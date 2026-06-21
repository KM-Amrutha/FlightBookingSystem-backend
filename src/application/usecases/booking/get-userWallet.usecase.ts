import { inject, injectable } from "inversify";
import { IUserWalletRepository } from "@domain/interfaces/IUserWalletRepository";
import { IGetUserWalletUseCase } from "@application/interfaces/usecase/booking/IGet-userWalletUsecase";
import { UserWalletResponseDTO } from "@application/dtos/wallet-dtos";
import { UserWalletMapper } from "@application/mappers/userWalletMapper";
import { NotFoundError } from "@presentation/middlewares/error.middleware";
import { TYPES_BOOKING_REPOSITORIES } from "@di/types-repositories";
import { WALLET_MESSAGES } from "@shared/constants/walletMessages/wallet.messages";

@injectable()
export class GetUserWalletUseCase implements IGetUserWalletUseCase {
  constructor(
    @inject(TYPES_BOOKING_REPOSITORIES.UserWalletRepository)
    private readonly _userWalletRepository: IUserWalletRepository
  ) {}

  async execute(userId: string): Promise<UserWalletResponseDTO> {
    let wallet = await this._userWalletRepository.getWalletByUserId(userId);

    // ── auto-create wallet on first access ────────────────────────────────
    if (!wallet) {
      wallet = await this._userWalletRepository.createWallet(userId);
    }

    if (!wallet) throw new NotFoundError(WALLET_MESSAGES.WALLET_NOT_FOUND);

    return UserWalletMapper.toWalletResponseDTO(wallet);
  }
}