import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_BOOKING_USECASES } from "@di/types-usecases";
import { IGetProviderWalletUseCase } from "@di/file-imports-index";
import { WALLET_MESSAGES } from "@shared/constants/walletMessages/wallet.messages";

@injectable()
export class GetProviderWalletController {
  constructor(
    @inject(TYPES_BOOKING_USECASES.GetProviderWalletUseCase)
    private readonly _getProviderWalletUseCase: IGetProviderWalletUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const providerId = req.user!.id;

    const result = await this._getProviderWalletUseCase.execute(providerId);

    sendResponse(res, WALLET_MESSAGES.WALLET_RETRIEVED, result, StatusCodes.OK);
  }
}