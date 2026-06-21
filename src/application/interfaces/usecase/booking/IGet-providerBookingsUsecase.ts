import { BookingListItemDTO } from "@application/dtos/booking-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";

export interface IGetProviderBookingsUseCase {
  execute(
    providerId: string,
    page: number,
    limit: number
  ): Promise<{
    bookingsList: BookingListItemDTO[];
    paginationData: PaginationDTO;
  }>;
}