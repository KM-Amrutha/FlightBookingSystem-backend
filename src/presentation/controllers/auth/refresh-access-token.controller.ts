import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes, JWT_MESSAGES } from "@shared/constants/index.constants";
import { TokenUseCase } from "@di/file-imports-index";
import { TYPES_AUTH_USECASES } from "@di/types-usecases";

@injectable()
export class RefreshAccessTokenController {
  constructor(
    @inject(TYPES_AUTH_USECASES.TokenUseCase)
    private _tokenUseCase: TokenUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req?.cookies;

    const newAccessToken = await this._tokenUseCase.refreshAccessToken(
      refreshToken
    );

    sendResponse(
      res,
      JWT_MESSAGES.TOKEN_REFRESH_SUCCESS,
      { newAccessToken },
      StatusCodes.OK,
    );
  }
}
