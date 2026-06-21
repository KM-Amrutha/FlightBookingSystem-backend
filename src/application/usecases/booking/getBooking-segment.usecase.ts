// ----------------------------------------------------PAGE  2--------------------------------------------//
import { inject, injectable } from "inversify";
import { IRedisService } from "@application/interfaces/service/cache/IRedis.service";
import { IGetBookingSegmentUseCase } from "@di/file-imports-index";
import {
  BookingSegmentCacheDTO,
  BookingSegmentResponseDTO,
} from "@application/dtos/booking-dtos";
import { NotFoundError, validationError } from "@presentation/middlewares/error.middleware";
import { TYPES_SERVICES } from "@di/types-services";
import { BookingCacheMapper } from "@application/mappers/bookingCacheMapper";
import {BOOKING_MESSAGES} from "@shared/constants/bookingMessages/booking.messages";

@injectable()
export class GetBookingSegmentUseCase implements IGetBookingSegmentUseCase {
  constructor(
    @inject(TYPES_SERVICES.RedisService)
    private _redisService: IRedisService
  ) {}

  async execute(
    userId: string,
    sessionId: string
  ): Promise<BookingSegmentResponseDTO> {
    if (!sessionId) {
      throw new validationError(BOOKING_MESSAGES.SESSION_ID_REQUIRED);
    }

    const cache = await this._redisService.get<BookingSegmentCacheDTO>(
      `booking-segment:${sessionId}`
    );

    if (!cache) {
      throw new NotFoundError(BOOKING_MESSAGES.SESSION_NOT_FOUND);
    }

    if (cache.userId !== userId) {
      throw new validationError(BOOKING_MESSAGES.SESSION_INVALID);
    }

    return BookingCacheMapper.toBookingSegmentResponseDTO(cache);
    
  }
}