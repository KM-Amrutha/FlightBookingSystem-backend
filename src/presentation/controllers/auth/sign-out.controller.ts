import { Request, Response } from "express";
import { injectable } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { AUTH_MESSAGES, StatusCodes } from "@shared/constants/index.constants";
import { clearRefreshTokenCookie } from "@shared/utils/cookie";

@injectable()
export class SignOutController {
  async handle(req: Request, res: Response): Promise<void> {
    clearRefreshTokenCookie(res);

    sendResponse(res,AUTH_MESSAGES.LOGOUT_SUCCESS, null,  StatusCodes.OK,);
  }
}