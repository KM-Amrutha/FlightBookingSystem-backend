import { IBooking } from "@domain/entities/booking.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";

export interface IBookingRepository extends IBaseRepository<IBooking> {
  // Create booking — called at payment initiation (status: pending)
  createBooking(data: Partial<IBooking>): Promise<IBooking>;

  // Get booking by ID
  getBookingById(bookingId: string): Promise<IBooking | null>;

  // Update booking status — called by Stripe webhook
  updateBookingStatus(
    bookingId: string,
    status: "confirmed" | "payment_failed" | "cancelled",
    paymentIntentId?: string,
    paymentConfirmedAt?: Date
  ): Promise<IBooking | null>;

  // Get all bookings for a user (user booking list)
  getBookingsByUserId(
    userId: string,
    page: number,
    limit: number
  ): Promise<{
    bookings: IBooking[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }>;

  // Get all bookings for a provider (provider booking list)
  getBookingsByProviderId(
    providerId: string,
    page: number,
    limit: number
  ): Promise<{
    bookings: IBooking[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }>;

  // Get all bookings for admin (admin booking list)
  getAllBookings(
    page: number,
    limit: number
  ): Promise<{
    bookings: IBooking[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }>;

  // Cancel a single passenger — update that passenger's status + refundAmount
  cancelPassenger(
    bookingId: string,
    passengerId: string,
    refundAmount: number
  ): Promise<IBooking | null>;

  // Update entire booking status to cancelled — when all passengers cancelled
  cancelBooking(bookingId: string): Promise<IBooking | null>;

  // Get booking by paymentIntentId — used in Stripe webhook
  getBookingByPaymentIntentId(paymentIntentId: string): Promise<IBooking | null>;
}