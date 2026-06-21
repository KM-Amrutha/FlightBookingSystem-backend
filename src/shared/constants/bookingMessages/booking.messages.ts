export const BOOKING_MESSAGES = {
  // ─── Session ───────────────────────────────────────────────────────────────
  SESSION_ID_REQUIRED: "Session ID is required",
  SESSION_NOT_FOUND: "Booking session not found or expired",
  SESSION_INVALID: "Invalid booking session",
  SESSION_CLEARED: "No flights remaining in segment — booking session cleared",

  // ─── Passenger ────────────────────────────────────────────────────────────
  PASSENGER_COUNT_REQUIRED: "Passenger count must be at least 1",
  PASSENGER_COUNT_MAX: "Maximum 9 passengers allowed per booking",

  // ─── Flight ───────────────────────────────────────────────────────────────
  FLIGHT_NOT_AVAILABLE: "This flight is not available for booking",
  FLIGHT_ALREADY_DEPARTED: "Cannot book a flight that has already departed",
  FLIGHT_RETURN_NOT_BOOKABLE: "Return flights cannot be booked directly",
  FLIGHT_ALREADY_IN_SEGMENT: "This flight is already added to your booking",
  FLIGHT_NOT_IN_SEGMENT: "Flight not found in booking segment",
  FLIGHT_MAX_SEGMENTS: "Maximum 3 flights allowed per booking",

  // ─── Segment ──────────────────────────────────────────────────────────────
  SEGMENT_ADDED: "Flight added to booking segment successfully",
  SEGMENT_RETRIEVED: "Booking segment retrieved successfully",
  SEGMENT_UPDATED: "Booking segment updated successfully",
  SEGMENT_NOTHING_TO_UPDATE: "Nothing to update",

  // ─── Seat ─────────────────────────────────────────────────────────────────
  SEAT_ID_REQUIRED: "Seat ID is required",
  SEAT_NOT_FOUND: "Seat not found",
  SEAT_NOT_AVAILABLE: "Seat is not available",
  SEAT_LOCKED: "Seat locked successfully",
  SEAT_ALREADY_LOCKED: "Seat is already locked by another user",
  SEAT_LOCK_NOT_FOUND: "Seat lock not found or expired",
 SEATS_MAP_RETRIEVED: "Seat map retrieved successfully",
  // ─── Booking Details ──────────────────────────────────────────────────────
  DETAILS_SAVED: "Booking details saved successfully",
  DETAILS_NOT_FOUND: "Booking details not found or expired",
  DETAILS_INVALID_PASSENGER: "Invalid passenger details",
  DETAILS_SEAT_LOCK_EXPIRED: "One or more seat locks have expired. Please re-select your seats",

  // ─── Summary ──────────────────────────────────────────────────────────────
  SUMMARY_RETRIEVED: "Booking summary retrieved successfully",


  // ─── Payment ──────────────────────────────────────────────────────────────
  BOOKING_INITIATED: "Booking initiated successfully",
  BOOKING_NOT_FOUND: "Booking not found",
  BOOKING_CONFIRMED: "Booking confirmed successfully",
  BOOKING_PAYMENT_FAILED: "Payment failed. Please try again",
  BOOKING_CANCELLED: "Booking cancelled successfully",

  // ─── Cancellation ─────────────────────────────────────────────────────────
  PASSENGER_CANCELLED: "Passenger booking cancelled and refund initiated",
  PASSENGER_NOT_FOUND: "Passenger not found in booking",
  PASSENGER_ALREADY_CANCELLED: "This passenger booking is already cancelled",
  FLIGHT_ALREADY_DEPARTED_CANCEL: "Cannot cancel a booking for a flight that has already departed",
  BOOKING_ALREADY_CANCELLED: "This booking is already cancelled",
  BOOKING_RETRIEVED_SUCCESSFULLY: "Booking retrieved successfully",

  BOOKING_ID_REQUIRED: "Booking ID is required",
RETRY_NOT_ALLOWED: "Retry is only allowed for failed payments",
RETRY_WINDOW_EXPIRED: "Retry window has expired. Please create a new booking",
PAYMENT_RETRY_INITIATED: "Payment retry initiated successfully",
} as const;