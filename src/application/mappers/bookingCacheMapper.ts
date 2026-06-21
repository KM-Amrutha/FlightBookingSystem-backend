import {
  BookingSegmentCacheDTO,
  BookingSegmentResponseDTO,
  BookingDetailsCacheDTO,
  BookingSummaryResponseDTO,
} from "@application/dtos/booking-dtos";

export class BookingCacheMapper {

  // ─── BookingSegmentCacheDTO → BookingSegmentResponseDTO ──────────────────
  static toBookingSegmentResponseDTO(
    cache: BookingSegmentCacheDTO
  ): BookingSegmentResponseDTO {
    return {
      sessionId: cache.sessionId,
      passengerCount: cache.passengerCount,
      segments: cache.segments,
      createdAt: cache.createdAt,
    };
  }

  // ─── BookingDetailsCacheDTO → BookingSummaryResponseDTO ──────────────────
  static toBookingSummaryResponseDTO(
  detailsCache: BookingDetailsCacheDTO,
  segmentCache: BookingSegmentCacheDTO   
): BookingSummaryResponseDTO {
  return {
    sessionId: detailsCache.sessionId,
    segments: segmentCache.segments,   
    passengers: detailsCache.passengers.map((p) => ({
      passengerId: p.passengerId,
      name: p.name,
      dob: p.dob,
      gender: p.gender,
      address: p.address,
      mobile: p.mobile,
      extraLuggageKg: p.extraLuggageKg,
      seats: p.seats,
    })),
    flightFoods: detailsCache.flightFoods,
    fareBreakdown: detailsCache.fareBreakdown,
    createdAt: detailsCache.createdAt,
  };
}
}