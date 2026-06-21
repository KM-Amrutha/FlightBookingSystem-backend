import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_OFFER_USECASES } from "@di/types-usecases";
import { ICreateOfferUseCase } from "@di/file-imports-index";
import { CreateOfferDTO } from "@application/dtos/offer-dtos";
import { OFFER_MESSAGES } from "@shared/constants/offerMessages/offer.messages";

@injectable()
export class CreateOfferController {
  constructor(
    @inject(TYPES_OFFER_USECASES.CreateOfferUseCase)
    private _createOfferUseCase: ICreateOfferUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const providerId = req.user!.id;
    const {
      aircraftId, offerCode, description,
      discountPercentage, minimumAmount,
      validFrom, validTo, usageLimit,
    } = req.body;

    const data: CreateOfferDTO = {
      aircraftId,
      offerCode,
      description,
      discountPercentage: Number(discountPercentage),
      minimumAmount: Number(minimumAmount),
      validFrom,
      validTo,
      ...(usageLimit && { usageLimit: Number(usageLimit) }),
    };

    const result = await this._createOfferUseCase.execute(providerId, data);

    sendResponse(res, OFFER_MESSAGES.OFFER_CREATED, result, StatusCodes.CREATED);
  }
}