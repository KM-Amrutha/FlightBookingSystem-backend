import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_OFFER_USECASES } from "@di/types-usecases";
import { IGetProviderOffersUseCase } from "@di/file-imports-index";
import { OFFER_MESSAGES } from "@shared/constants/offerMessages/offer.messages";
import { parseQueryParams } from "@shared/utils/parse-queryParams";

@injectable()
export class GetProviderOffersController {
  constructor(
    @inject(TYPES_OFFER_USECASES.GetProviderOffersUseCase)
    private _getProviderOffersUseCase: IGetProviderOffersUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const providerId = req.user!.id;
    const { page, limit } = parseQueryParams(req.query);

    const result = await this._getProviderOffersUseCase.execute(
      providerId,
      page,
      limit
    );

    sendResponse(res, OFFER_MESSAGES.OFFERS_RETRIEVED, result, StatusCodes.OK);
  }
}