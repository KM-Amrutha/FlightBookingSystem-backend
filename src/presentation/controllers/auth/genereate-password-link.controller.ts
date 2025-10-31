import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { AuthStatus, StatusCodes } from "@shared/constants/index.constants";
import { SendPasswordRestLinkUseCase } from "@application/usecases/auth/send-password-reset-link.usecase";
import { TYPES_AUTH_USECASES } from "@di/types-usecases";

@injectable()
export class PasswordResetLinkController {
  constructor(
    @inject(TYPES_AUTH_USECASES.SendPasswordRestLinkUseCase)
    private _sendPasswordRestLinkUseCase: SendPasswordRestLinkUseCase
  ) {}
  async handle(req: Request, res: Response): Promise<void> {
    const { email } = await this._sendPasswordRestLinkUseCase.execute(req.body);

    sendResponse(res,email,  AuthStatus.EmailSent,StatusCodes.OK,);
  }
}
