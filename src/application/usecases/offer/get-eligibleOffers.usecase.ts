import { inject, injectable } from "inversify";
import { IOfferRepository } from "@domain/interfaces/IOfferRepository";
import { IRedisService } from "@application/interfaces/service/cache/IRedis.service";
import { IGetEligibleOffersUseCase } from "@di/file-imports-index";
import { EligibleOfferResponseDTO } from "@application/dtos/offer-dtos";
import {
  BookingSegmentCacheDTO,
  BookingDetailsCacheDTO,
} from "@application/dtos/booking-dtos";
import { NotFoundError, validationError } from "@presentation/middlewares/error.middleware";
import { TYPES_BOOKING_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";
import { OfferMapper } from "@application/mappers/offerMapper";
import { BOOKING_MESSAGES } from "@shared/constants/bookingMessages/booking.messages";

@injectable()
export class GetEligibleOffersUseCase implements IGetEligibleOffersUseCase {
  constructor(
    @inject(TYPES_BOOKING_REPOSITORIES.OfferRepository)
    private _offerRepository: IOfferRepository,
    @inject(TYPES_SERVICES.RedisService)
    private _redisService: IRedisService
  ) {}

  async execute(
    userId: string,
    sessionId: string
  ): Promise<EligibleOfferResponseDTO[]> {
    if (!sessionId) {
      throw new validationError(BOOKING_MESSAGES.SESSION_ID_REQUIRED);
    }

    // ── load both Redis keys ──────────────────────────────────────────────
    const [segmentCache, detailsCache] = await Promise.all([
      this._redisService.get<BookingSegmentCacheDTO>(
        `booking-segment:${sessionId}`
      ),
      this._redisService.get<BookingDetailsCacheDTO>(
        `booking-details:${sessionId}`
      ),
    ]);

    if (!segmentCache) {
      throw new NotFoundError(BOOKING_MESSAGES.SESSION_NOT_FOUND);
    }
    if (!detailsCache) {
      throw new NotFoundError(BOOKING_MESSAGES.DETAILS_NOT_FOUND);
    }
    if (segmentCache.userId !== userId || detailsCache.userId !== userId) {
      throw new validationError(BOOKING_MESSAGES.SESSION_INVALID);
    }

    // ── extract aircraftIds from segment ──────────────────────────────────
    const aircraftIds = segmentCache.segments.map((s) => s.aircraftId);

    const grandTotal = detailsCache.fareBreakdown.grandTotal;

    // ── fetch eligible offers ─────────────────────────────────────────────
    const offers = await this._offerRepository.getEligibleOffersByAircraftIds(
      aircraftIds,
      grandTotal,
      new Date()
    );

    return OfferMapper.toEligibleOfferResponseDTOs(offers, grandTotal);
  }
}