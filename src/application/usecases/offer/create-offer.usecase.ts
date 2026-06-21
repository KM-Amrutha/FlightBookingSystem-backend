import { inject, injectable } from "inversify";
import { IOfferRepository } from "@domain/interfaces/IOfferRepository";
import { IAircraftRepository } from "@domain/interfaces/IAircraftRepository";
import { ICreateOfferUseCase } from "@di/file-imports-index";
import { CreateOfferDTO, OfferResponseDTO } from "@application/dtos/offer-dtos";
import { NotFoundError, validationError, ForbiddenError } from "@presentation/middlewares/error.middleware";
import { TYPES_AIRCRAFT_REPOSITORIES, TYPES_BOOKING_REPOSITORIES } from "@di/types-repositories";
import { OfferMapper } from "@application/mappers/offerMapper";
import { OFFER_MESSAGES } from "@shared/constants/offerMessages/offer.messages";

@injectable()
export class CreateOfferUseCase implements ICreateOfferUseCase {
  constructor(
    @inject(TYPES_BOOKING_REPOSITORIES.OfferRepository)
    private _offerRepository: IOfferRepository,
    @inject(TYPES_AIRCRAFT_REPOSITORIES.AircraftRepository)
    private _aircraftRepository: IAircraftRepository
  ) {}

  async execute(
    providerId: string,
    data: CreateOfferDTO
  ): Promise<OfferResponseDTO> {
    if (
      !data.aircraftId ||
      !data.offerCode ||
      !data.description ||
      !data.discountPercentage ||
      !data.minimumAmount ||
      !data.validFrom ||
      !data.validTo
    ) {
      throw new validationError(OFFER_MESSAGES.OFFER_ALL_FIELDS_REQUIRED);
    }

    if (data.discountPercentage < 1 || data.discountPercentage > 100) {
      throw new validationError(OFFER_MESSAGES.OFFER_INVALID_DISCOUNT);
    }

    if (data.minimumAmount < 0) {
      throw new validationError(OFFER_MESSAGES.OFFER_INVALID_MINIMUM_AMOUNT);
    }

    const validFrom = new Date(data.validFrom);
    const validTo = new Date(data.validTo);

    if (isNaN(validFrom.getTime()) || isNaN(validTo.getTime())) {
      throw new validationError(OFFER_MESSAGES.OFFER_INVALID_DATE);
    }

    if (validFrom >= validTo) {
      throw new validationError(OFFER_MESSAGES.OFFER_INVALID_DATE_RANGE);
    }

    if (validFrom < new Date()) {
      throw new validationError(OFFER_MESSAGES.OFFER_PAST_DATE);
    }

    // ── validate aircraft ownership ───────────────────────────────────────
    const aircraft = await this._aircraftRepository.getAircraftById(
      data.aircraftId
    );
    if (!aircraft) {
      throw new NotFoundError(OFFER_MESSAGES.OFFER_AIRCRAFT_NOT_FOUND);
    }
    if (aircraft.providerId !== providerId) {
      throw new ForbiddenError(OFFER_MESSAGES.OFFER_NOT_YOUR_AIRCRAFT);
    }

    // ── check offer code uniqueness ───────────────────────────────────────
    const existing = await this._offerRepository.getOfferByCode(data.offerCode);
    if (existing) {
      throw new validationError(OFFER_MESSAGES.OFFER_CODE_EXISTS);
    }

    const offer = await this._offerRepository.createOffer({
      aircraftId: data.aircraftId,
      providerId,
      offerCode: data.offerCode.toUpperCase().trim(),
      description: data.description,
      discountPercentage: data.discountPercentage,
      minimumAmount: data.minimumAmount,
      validFrom,
      validTo,
      isActive: true,
      usageCount: 0,
      ...(data.usageLimit && { usageLimit: data.usageLimit }),
    });

    return OfferMapper.toOfferResponseDTO(offer);
  }
}