import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { AuthStatus, StatusCodes } from "@shared/constants/index.constants";
import { SignInUseCase } from "@application/usecases/auth/signin-user.usecases";
import { setRefreshTokenCookie } from "@shared/utils/cookie";
import { TYPES_AUTH_USECASES } from "@di/types-usecases";


@injectable()
export class SignInController {
  constructor(
    @inject(TYPES_AUTH_USECASES.SignInUseCase)
    private _signinUseCase: SignInUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { userData, accessToken, refreshToken } =
      await this._signinUseCase.execute(req.body);

    setRefreshTokenCookie(res, refreshToken);

    sendResponse(
      res,
      AuthStatus.LoginSuccess,
      { userData, accessToken },
      StatusCodes.OK,
    );
  }
}