import { inject, injectable } from "inversify";
import { IOfferRepository } from "@domain/interfaces/IOfferRepository";
import { IGetProviderOffersUseCase } from "@di/file-imports-index";
import { PaginatedOffersResponseDTO } from "@application/dtos/offer-dtos";
import { validationError } from "@presentation/middlewares/error.middleware";
import { TYPES_BOOKING_REPOSITORIES } from "@di/types-repositories";
import { OfferMapper } from "@application/mappers/offerMapper";
import { OFFER_MESSAGES } from "@shared/constants/offerMessages/offer.messages";

@injectable()
export class GetProviderOffersUseCase implements IGetProviderOffersUseCase {
  constructor(
    @inject(TYPES_BOOKING_REPOSITORIES.OfferRepository)
    private _offerRepository: IOfferRepository
  ) {}

  async execute(
    providerId: string,
    page: number,
    limit: number
  ): Promise<PaginatedOffersResponseDTO> {
    if (!providerId) {
      throw new validationError(OFFER_MESSAGES.OFFER_PROVIDER_REQUIRED);
    }

    const result = await this._offerRepository.getOffersByProviderId(
      providerId,
      page,
      limit
    );

    return {
      offers: OfferMapper.toOfferResponseDTOs(result.offers),
      totalCount: result.totalCount,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
    };
  }
}