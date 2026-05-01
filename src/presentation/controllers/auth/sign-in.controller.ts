import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { AUTH_MESSAGES, StatusCodes } from "@shared/constants/index.constants";
import { SignInUseCase } from "@di/file-imports-index";
import { setRefreshTokenCookie } from "@shared/utils/cookie";
import { TYPES_AUTH_USECASES } from "@di/types-usecases";



@injectable()
export class SignInController {
  constructor(
    @inject(TYPES_AUTH_USECASES.SignInUseCase)
    private _signinUseCase: SignInUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    
       const result = await this._signinUseCase.execute(req.body);

    setRefreshTokenCookie(res, result.refreshToken);

    const data = "userData" in result
    ? { userData: result.userData, accessToken: result.accessToken }
    : { providerData: result.providerData, accessToken: result.accessToken };

  sendResponse(res, AUTH_MESSAGES.LOGIN_SUCCESS, data, StatusCodes.OK);
  
  }
}