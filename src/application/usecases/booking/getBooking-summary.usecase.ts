// ---------------------------------------------------- PAGE 4-------------------------------------------//
import { inject, injectable } from "inversify";
import { IRedisService } from "@application/interfaces/service/cache/IRedis.service";
import { IGetBookingSummaryUseCase } from "@di/file-imports-index";
import {
  BookingSegmentCacheDTO,
  BookingDetailsCacheDTO,
  BookingSummaryResponseDTO,
} from "@application/dtos/booking-dtos";
import { NotFoundError, validationError } from "@presentation/middlewares/error.middleware";
import { TYPES_SERVICES } from "@di/types-services";
import { BookingCacheMapper } from "@application/mappers/bookingCacheMapper";
import { BOOKING_MESSAGES } from "@shared/constants/bookingMessages/booking.messages";

@injectable()
export class GetBookingSummaryUseCase implements IGetBookingSummaryUseCase {
  constructor(
    @inject(TYPES_SERVICES.RedisService)
    private _redisService: IRedisService
  ) {}

  async execute(
    userId: string,
    sessionId: string
  ): Promise<BookingSummaryResponseDTO> {
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
    
    return BookingCacheMapper.toBookingSummaryResponseDTO(detailsCache, segmentCache); 
  }
};

