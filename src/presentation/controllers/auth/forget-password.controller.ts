import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { validationError } from "@presentation/middlewares/error.middleware";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes, PasswordStatus } from "@shared/constants/index.constants";
import { ForgotPasswordUseCase } from "@application/usecases/auth/forgot-password.usecase";
import { TYPES_AUTH_USECASES } from "@di/types-usecases";

@injectable()
export class ForgotPasswordController {
  constructor(
    @inject(TYPES_AUTH_USECASES.ForgotPasswordUseCase)
    private _forgotPasswordUseCase: ForgotPasswordUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { token } = req.params;
    const { password } = req.body;

      if (!token) {
      throw new validationError("Reset token is required");
    }
    if (!password) {
      throw new validationError("New password is required");
    }

    const resetData = { resetToken: token, password: password };

    await this._forgotPasswordUseCase.execute(resetData);

    sendResponse(res, PasswordStatus.ResetSuccess, null,StatusCodes.OK,);
  }
}
