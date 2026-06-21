import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_OFFER_USECASES } from "@di/types-usecases";
import { IGetEligibleOffersUseCase } from "@di/file-imports-index";
import { OFFER_MESSAGES } from "@shared/constants/offerMessages/offer.messages";

@injectable()
export class GetEligibleOffersController {
  constructor(
    @inject(TYPES_OFFER_USECASES.GetEligibleOffersUseCase)
    private _getEligibleOffersUseCase: IGetEligibleOffersUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { sessionId } = req.params;
    if(!sessionId){
        throw new Error()
    }

    const result = await this._getEligibleOffersUseCase.execute(
      userId,
      sessionId
    );

    sendResponse(res, OFFER_MESSAGES.OFFERS_RETRIEVED, result, StatusCodes.OK);
  }
}