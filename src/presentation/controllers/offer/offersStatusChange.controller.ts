import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_OFFER_USECASES } from "@di/types-usecases";
import { IOfferStatusChangeUseCase } from "@di/file-imports-index";
import { OFFER_MESSAGES } from "@shared/constants/offerMessages/offer.messages";

@injectable()
export class OfferStatusChangeController {
  constructor(
    @inject(TYPES_OFFER_USECASES.OfferStatusChangeUseCase)
    private _toggleOfferStatusUseCase: IOfferStatusChangeUseCase
  ) {}

async handle(req: Request, res: Response): Promise<void> {
  console.log("Inside OfferStatusChangeController");
  const providerId = req.user!.id;
  const { offerId } = req.params;

  if (!offerId) 
    throw new Error(OFFER_MESSAGES.OFFER_ID_REQUIRED);

  const result = await this._toggleOfferStatusUseCase.execute(
    providerId,
    offerId   
  );
console.log("result from the controller", result);
  sendResponse(res, OFFER_MESSAGES.OFFER_UPDATED, result, StatusCodes.OK);
}
}