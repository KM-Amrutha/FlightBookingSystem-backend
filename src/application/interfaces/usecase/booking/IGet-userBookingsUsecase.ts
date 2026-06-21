import { BookingListItemDTO } from "@application/dtos/booking-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";

export interface IGetUserBookingsUseCase {
  execute(
    userId: string,
    page: number,
    limit: number
  ): Promise<{
    bookingsList: BookingListItemDTO[];
    paginationData: PaginationDTO;
  }>;
}