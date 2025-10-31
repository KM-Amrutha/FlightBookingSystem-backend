import { Request,Response } from "express";
import {inject,injectable} from 'inversify';
import { sendResponse } from "@shared/utils/http.response";
import {
    AuthStatus,
    StatusCodes,
    OTPStatus
} from "@shared/constants/index.constants";

import { OtpUseCase } from "@application/usecases/auth/otp.usecase";
import { TYPES_AUTH_USECASES } from "@di/types-usecases";

@injectable()
export class OtpController {
  constructor(
    @inject(TYPES_AUTH_USECASES.OtpUseCase)
     private _otpUseCase: OtpUseCase
  ) {}

  async verifyOtp(req: Request, res: Response): Promise<void> {
    await this._otpUseCase.verifyOtp(req.body);

    sendResponse(res, AuthStatus.RegistrationSuccess, null,StatusCodes.OK);
  }

  async resendOtp(req: Request, res: Response): Promise<void> {
    await this._otpUseCase.resendOtp(req.body);

    sendResponse(res, OTPStatus.Sent,null, StatusCodes.OK);
  }
}