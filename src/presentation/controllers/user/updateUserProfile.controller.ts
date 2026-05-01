import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_USER_USECASES } from "@di/types-usecases";
import { IUpdateUserProfileUseCase } from "@di/file-imports-index";
import { UpdateUserProfileDTO } from "@application/dtos/user-dtos";

@injectable()
export class UpdateUserProfileController {
  constructor(
    @inject(TYPES_USER_USECASES.UpdateUserProfileUseCase)
    private _updateUserProfileUseCase: IUpdateUserProfileUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!._id;

      const dto: UpdateUserProfileDTO = {
        userId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        mobile: req.body.mobile,
        dateOfBirth: req.body.dateOfBirth,
        gender: req.body.gender,
        address1: req.body.address1,
        address2: req.body.address2,
        profilePicture: req.body.profilePicture,
      };

      const updated = await this._updateUserProfileUseCase.execute(dto);

      sendResponse(res, "Profile updated successfully", updated, StatusCodes.OK);
    } catch (error: any) {
      sendResponse(res, error.message, null, StatusCodes.BAD_REQUEST);
    }
  }
}