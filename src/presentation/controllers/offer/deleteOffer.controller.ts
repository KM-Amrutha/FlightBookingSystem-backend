import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_OFFER_USECASES } from "@di/types-usecases";
import { IDeleteOfferUseCase } from "@di/file-imports-index";
import { OFFER_MESSAGES } from "@shared/constants/offerMessages/offer.messages";

@injectable()
export class DeleteOfferController {
  constructor(
    @inject(TYPES_OFFER_USECASES.DeleteOfferUseCase)
    private _deleteOfferUseCase: IDeleteOfferUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const providerId = req.user!.id;
    const { offerId } = req.params;
    if(!offerId){
        throw new Error()
    }

    const result = await this._deleteOfferUseCase.execute(providerId, offerId);

    sendResponse(res, OFFER_MESSAGES.OFFER_DELETED, result, StatusCodes.OK);
  }
}