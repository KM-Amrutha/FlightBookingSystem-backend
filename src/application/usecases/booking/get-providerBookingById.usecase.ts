import { inject, injectable } from "inversify";
import { IBookingRepository } from "@domain/interfaces/IBookingRepository";
import { IGetProviderBookingByIdUseCase } from "@application/interfaces/usecase/booking/IGet-ProviderBookingByIdUsecase";
import { ProviderBookingDetailResponseDTO } from "@application/dtos/booking-dtos";
import { BookingMapper } from "@application/mappers/bookingMapper";
import {
  NotFoundError,
  ForbiddenError,
  validationError,
} from "@presentation/middlewares/error.middleware";
import { TYPES_BOOKING_REPOSITORIES } from "@di/types-repositories";
import { BOOKING_MESSAGES } from "@shared/constants/bookingMessages/booking.messages";

@injectable()
export class GetProviderBookingByIdUseCase
  implements IGetProviderBookingByIdUseCase
{
  constructor(
    @inject(TYPES_BOOKING_REPOSITORIES.BookingRepository)
    private readonly _bookingRepository: IBookingRepository
  ) {}

  async execute(
    providerId: string,
    bookingId: string
  ): Promise<ProviderBookingDetailResponseDTO> {
    if (!bookingId) {
      throw new validationError(BOOKING_MESSAGES.BOOKING_ID_REQUIRED);
    }

    const booking = await this._bookingRepository.getBookingById(bookingId);
    if (!booking) throw new NotFoundError(BOOKING_MESSAGES.BOOKING_NOT_FOUND);

    // verify at least one segment belongs to this provider
    const hasSegment = booking.passengers.some((p) =>
      p.segments.some(
        (s) => s.providerId.toString() === providerId.toString()
      )
    );

    if (!hasSegment) {
      throw new ForbiddenError(BOOKING_MESSAGES.SESSION_INVALID);
    }

    return BookingMapper.toProviderBookingDetailResponseDTO(
      booking,
      providerId
    );
  }
}