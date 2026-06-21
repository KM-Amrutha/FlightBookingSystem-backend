import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_BOOKING_USECASES } from "@di/types-usecases";
import { IGetUserWalletUseCase } from "@di/file-imports-index";
import { WALLET_MESSAGES } from "@shared/constants/walletMessages/wallet.messages";

@injectable()
export class GetUserWalletController {
  constructor(
    @inject(TYPES_BOOKING_USECASES.GetUserWalletUseCase)
    private readonly _getUserWalletUseCase: IGetUserWalletUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;

    const result = await this._getUserWalletUseCase.execute(userId);

    sendResponse(res, WALLET_MESSAGES.WALLET_RETRIEVED, result, StatusCodes.OK);
  }
}