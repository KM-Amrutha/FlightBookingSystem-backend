import cron from "node-cron";
import { IBookingRepository,
         IFlightSeatRepository
 } from "@di/file-imports-index";

const RETRY_WINDOW_MS = 30 * 60 * 1000;

export const startBookingCleanupJob = (
  bookingRepository: IBookingRepository,
  flightSeatRepository: IFlightSeatRepository
): void => {
  cron.schedule("*/5 * * * *", async () => {
    try {
      const cutoffTime = new Date(Date.now() - RETRY_WINDOW_MS);
      const staleBookings = await bookingRepository.getStalePendingBookings(cutoffTime);

      if (staleBookings.length === 0) return;

      console.log(`Cleanup job — processing ${staleBookings.length} stale bookings`);

      for (const booking of staleBookings) {
        try {
          for (const passenger of booking.passengers) {
            for (const segment of passenger.segments) {
              await flightSeatRepository.unlockSeat(segment.flightSeatId);
            }
          }
          await bookingRepository.cancelBooking(booking.id);
          console.log(`Cleanup job — booking ${booking.id} cancelled`);
        } catch (err) {
          console.error(`Cleanup job — failed for booking ${booking.id}:`, err);
        }
      }
    } catch (err) {
      console.error("Cleanup job — error:", err);
    }
  });

  console.log("Booking cleanup job started");
};