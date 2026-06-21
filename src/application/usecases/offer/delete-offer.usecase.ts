import { inject, injectable } from "inversify";
import { IOfferRepository } from "@domain/interfaces/IOfferRepository";
import { IDeleteOfferUseCase } from "@di/file-imports-index";
import { OfferResponseDTO } from "@application/dtos/offer-dtos";
import { NotFoundError, validationError, ForbiddenError } from "@presentation/middlewares/error.middleware";
import { TYPES_BOOKING_REPOSITORIES } from "@di/types-repositories";
import { OfferMapper } from "@application/mappers/offerMapper";
import { OFFER_MESSAGES } from "@shared/constants/offerMessages/offer.messages";

@injectable()
export class DeleteOfferUseCase implements IDeleteOfferUseCase {
  constructor(
    @inject(TYPES_BOOKING_REPOSITORIES.OfferRepository)
    private _offerRepository: IOfferRepository
  ) {}

  async execute(
    providerId: string,
    offerId: string
  ): Promise<OfferResponseDTO> {
    if (!offerId) {
      throw new validationError(OFFER_MESSAGES.OFFER_ID_REQUIRED);
    }

    const offer = await this._offerRepository.getOfferById(offerId);
    if (!offer) {
      throw new NotFoundError(OFFER_MESSAGES.OFFER_NOT_FOUND);
    }
    if (offer.providerId.toString() !== providerId.toString()) {
      throw new ForbiddenError(OFFER_MESSAGES.OFFER_NOT_YOUR_OFFER);
    }

    const deleted = await this._offerRepository.deleteOfferById(offerId);
    if (!deleted) throw new NotFoundError(OFFER_MESSAGES.OFFER_NOT_FOUND);

    return OfferMapper.toOfferResponseDTO(deleted);
  }
}