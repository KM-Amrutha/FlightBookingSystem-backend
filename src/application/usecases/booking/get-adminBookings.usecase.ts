import { inject, injectable } from "inversify";
import { IBookingRepository } from "@domain/interfaces/IBookingRepository";
import { IGetAdminBookingsUseCase } from "@di/file-imports-index";
import { BookingListItemDTO } from "@application/dtos/booking-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { BookingMapper } from "@application/mappers/bookingMapper";
import { TYPES_BOOKING_REPOSITORIES } from "@di/types-repositories";
import { paginateReq, paginateRes } from "@shared/utils/pagination";

@injectable()
export class GetAdminBookingsUseCase implements IGetAdminBookingsUseCase {
  constructor(
    @inject(TYPES_BOOKING_REPOSITORIES.BookingRepository)
    private readonly _bookingRepository: IBookingRepository
  ) {}

  async execute(
    page: number,
    limit: number
  ): Promise<{
    bookingsList: BookingListItemDTO[];
    paginationData: PaginationDTO;
  }> {
    const { pageNumber, limitNumber } = paginateReq(page, limit);

    const { bookings, totalCount } =
      await this._bookingRepository.getAllBookings(pageNumber, limitNumber);

    const paginationData = paginateRes({ totalCount, pageNumber, limitNumber });

    return {
      bookingsList: BookingMapper.toBookingListDTOs(bookings),
      paginationData,
    };
  }
}