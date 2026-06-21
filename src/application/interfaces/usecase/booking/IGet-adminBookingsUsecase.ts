import { BookingListItemDTO } from "@application/dtos/booking-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";

export interface IGetAdminBookingsUseCase {
  execute(
    page: number,
    limit: number
  ): Promise<{
    bookingsList: BookingListItemDTO[];
    paginationData: PaginationDTO;
  }>;
}