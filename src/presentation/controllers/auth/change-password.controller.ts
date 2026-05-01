import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_AUTH_USECASES } from "@di/types-usecases";
import { IChangePasswordUseCase } from "@application/interfaces/usecase/auth/IChange-password.usecase";
import { ChangePasswordDTO } from "@application/dtos/auth-dtos";

@injectable()
export class ChangePasswordController {
  constructor(
    @inject(TYPES_AUTH_USECASES.ChangePasswordUseCase)
    private _changePasswordUseCase: IChangePasswordUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!._id;

      const dto: ChangePasswordDTO = {
        userId,
        password: req.body.password,
        newPassword: req.body.newPassword,
      };

      await this._changePasswordUseCase.execute(dto);

      sendResponse(res, "Password changed successfully", null, StatusCodes.OK);
    } catch (error: any) {
      sendResponse(res, error.message, null, StatusCodes.BAD_REQUEST);
    }
  }
}