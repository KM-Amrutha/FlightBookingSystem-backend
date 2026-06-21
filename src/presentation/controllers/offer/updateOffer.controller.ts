import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_OFFER_USECASES } from "@di/types-usecases";
import { IUpdateOfferUseCase } from "@di/file-imports-index";
import { UpdateOfferDTO } from "@application/dtos/offer-dtos";
import { OFFER_MESSAGES } from "@shared/constants/offerMessages/offer.messages";

@injectable()
export class UpdateOfferController {
  constructor(
    @inject(TYPES_OFFER_USECASES.UpdateOfferUseCase)
    private _updateOfferUseCase: IUpdateOfferUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const providerId = req.user!.id;
    const { offerId } = req.params;
    const {
      description, validFrom, validTo,
      isActive, offerCode, discountPercentage,
      minimumAmount, usageLimit,
    } = req.body;
    
    if(!offerId){
        throw new Error()
    }

    const data: UpdateOfferDTO = {
      ...(description && { description }),
      ...(validFrom && { validFrom }),
      ...(validTo && { validTo }),
      ...(isActive !== undefined && { isActive }),
      ...(offerCode && { offerCode }),
      ...(discountPercentage !== undefined && { discountPercentage: Number(discountPercentage) }),
      ...(minimumAmount !== undefined && { minimumAmount: Number(minimumAmount) }),
      ...(usageLimit !== undefined && { usageLimit: Number(usageLimit) }),
    };

    const result = await this._updateOfferUseCase.execute(
      providerId,
      offerId,
      data
    );

    sendResponse(res, OFFER_MESSAGES.OFFER_UPDATED, result, StatusCodes.OK);
  }
}