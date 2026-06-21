import { inject, injectable } from "inversify";
import { IOfferRepository } from "@domain/interfaces/IOfferRepository";
import { IUpdateOfferUseCase } from "@di/file-imports-index";
import { UpdateOfferDTO, OfferResponseDTO } from "@application/dtos/offer-dtos";
import { NotFoundError, validationError, ForbiddenError } from "@presentation/middlewares/error.middleware";
import { TYPES_BOOKING_REPOSITORIES } from "@di/types-repositories";
import { OfferMapper } from "@application/mappers/offerMapper";
import { OFFER_MESSAGES } from "@shared/constants/offerMessages/offer.messages";

@injectable()
export class UpdateOfferUseCase implements IUpdateOfferUseCase {
  constructor(
    @inject(TYPES_BOOKING_REPOSITORIES.OfferRepository)
    private _offerRepository: IOfferRepository
  ) {}

  async execute(
    providerId: string,
    offerId: string,
    data: UpdateOfferDTO
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

    // ── usage restriction check ───────────────────────────────────────────
    if (offer.usageCount > 0) {
      if (
        data.offerCode !== undefined ||
        data.discountPercentage !== undefined ||
        data.minimumAmount !== undefined ||
        data.usageLimit !== undefined
      ) {
        throw new validationError(OFFER_MESSAGES.OFFER_CANNOT_EDIT_USED);
      }
    }

    // ── validate dates if provided ────────────────────────────────────────
    const validFrom = data.validFrom ? new Date(data.validFrom) : offer.validFrom;
    const validTo = data.validTo ? new Date(data.validTo) : offer.validTo;

    if (data.validFrom && isNaN(validFrom.getTime())) {
      throw new validationError(OFFER_MESSAGES.OFFER_INVALID_DATE);
    }
    if (data.validTo && isNaN(validTo.getTime())) {
      throw new validationError(OFFER_MESSAGES.OFFER_INVALID_DATE);
    }
    if (validFrom >= validTo) {
      throw new validationError(OFFER_MESSAGES.OFFER_INVALID_DATE_RANGE);
    }

    // ── validate discount if provided ─────────────────────────────────────
    if (
      data.discountPercentage !== undefined &&
      (data.discountPercentage < 1 || data.discountPercentage > 100)
    ) {
      throw new validationError(OFFER_MESSAGES.OFFER_INVALID_DISCOUNT);
    }

    // ── check offer code uniqueness if changed ────────────────────────────
    if (data.offerCode && data.offerCode.toUpperCase() !== offer.offerCode) {
      const existing = await this._offerRepository.getOfferByCode(data.offerCode);
      if (existing) {
        throw new validationError(OFFER_MESSAGES.OFFER_CODE_EXISTS);
      }
    }

    const updated = await this._offerRepository.updateOffer(offerId, {
      ...(data.description && { description: data.description }),
      ...(data.validFrom && { validFrom }),
      ...(data.validTo && { validTo }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      ...(offer.usageCount === 0 && {
        ...(data.offerCode && { offerCode: data.offerCode.toUpperCase().trim() }),
        ...(data.discountPercentage && { discountPercentage: data.discountPercentage }),
        ...(data.minimumAmount !== undefined && { minimumAmount: data.minimumAmount }),
        ...(data.usageLimit !== undefined && { usageLimit: data.usageLimit }),
      }),
    });

    if (!updated) throw new NotFoundError(OFFER_MESSAGES.OFFER_NOT_FOUND);

    return OfferMapper.toOfferResponseDTO(updated);
  }
}