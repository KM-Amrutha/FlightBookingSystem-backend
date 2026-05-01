import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_USER_USECASES } from "@di/types-usecases";
import { IGetUserProfileUseCase } from "@di/file-imports-index";

@injectable()
export class GetUserProfileController {
  constructor(
    @inject(TYPES_USER_USECASES.GetUserProfileUseCase)
    private _getUserProfileUseCase: IGetUserProfileUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!._id;

      const user = await this._getUserProfileUseCase.execute(userId);

      sendResponse(res, "User profile fetched successfully", user, StatusCodes.OK);
    } catch (error: any) {
      sendResponse(res, error.message, null, StatusCodes.BAD_REQUEST);
    }
  }
}