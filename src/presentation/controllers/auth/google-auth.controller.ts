import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { AUTH_MESSAGES, StatusCodes } from "@shared/constants/index.constants";
import { GoogleAuthUseCase } from "@application/usecases/auth/google-auth.usecase";
import { setRefreshTokenCookie } from "@shared/utils/cookie";
import { TYPES_AUTH_USECASES } from "@di/types-usecases";

@injectable()
export class GoogleAuthController {
  constructor(
    @inject(TYPES_AUTH_USECASES.GoogleAuthUseCase)
    private googleAuthUseCase: GoogleAuthUseCase
  ) {}
  async handle(req: Request, res: Response): Promise<void> {
  try {
    const { token } = req.body;

    if (!token || typeof token !== "string") {
      sendResponse(
        res,
        "Invalid Google credential",
        null,
        StatusCodes.BAD_REQUEST
      );
      return; // early return to stop execution
    }

    const { userData, accessToken, refreshToken } =
      await this.googleAuthUseCase.execute({ token });

    setRefreshTokenCookie(res, refreshToken);

    sendResponse(
      res,
      AUTH_MESSAGES.LOGIN_SUCCESS,
      {
        user: userData,
        accessToken,
        role: userData.role,
      },
      StatusCodes.OK
    );
  } catch (error: any) {
    console.error("Google Auth Controller Error:", error);

    if (error.message.includes("GOOGLE_AUTH_FAILED") || error.message.includes("EMAIL_NOT_FOUND")) {
      sendResponse(
        res,
        "Invalid Google credential",
        null,
        StatusCodes.UNAUTHORIZED
      );
      return;
    }
    sendResponse(
      res,
      AUTH_MESSAGES.INTERNAL_SERVER_ERROR,
      null,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
}
