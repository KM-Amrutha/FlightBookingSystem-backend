import { IBooking } from "@domain/entities/booking.entity";

export interface IProviderWalletService {
  settleBookingRevenue(booking: IBooking): Promise<void>;
}