import {Request,Response} from 'express'
import { inject,injectable } from 'inversify'
import { sendResponse } from "@shared/utils/http.response";
import { AuthStatus, StatusCodes} from "@shared/constants/index.constants";
import { TYPES_AUTH_USECASES } from "@di/types-usecases";
import { CreateProviderUseCase } from '@application/usecases/auth/create-provider.usecase';


@injectable()
export class SignUpProviderController {
  constructor(
    @inject(TYPES_AUTH_USECASES.CreateProviderUseCase)
    private _createProviderUseCase: CreateProviderUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
      const mappedData = {
      companyName: req.body.companyName,
      email: req.body.email,
      mobile: req.body.mobile,           
      password: req.body.password,
      airlineCode: req.body.airlineCode 
    }as any;
    const createdTrainer = await this._createProviderUseCase.execute(mappedData);

    sendResponse(res, AuthStatus.UserCreated,createdTrainer,StatusCodes.OK );
  }
}
