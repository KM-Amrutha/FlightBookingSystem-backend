import { Request,Response } from "express";
import { inject,injectable } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { AuthStatus,StatusCodes } from "@shared/constants/index.constants";
import { CreateUserUseCase } from "@application/usecases/auth/create-user.usecases";
import { TYPES_AUTH_USECASES } from "@di/types-usecases";

@injectable()
export class SignUpUserController {
  constructor(
    @inject(TYPES_AUTH_USECASES.CreateUserUseCase)
    private _createUserUseCase: CreateUserUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const createdUser = await this._createUserUseCase.execute(req.body);

    sendResponse(res,AuthStatus.UserCreated,createdUser, StatusCodes.OK,  );
  }
}
 