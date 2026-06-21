import { FlightSeatMapDTO } from "./flightSeat-dtos";

export interface BookingSegmentFlightDTO {
  flightId: string;
  flightNumber: string;
  aircraftId: string;
  aircraftName: string;
  providerId: string; 
  providerName: string;
  providerLogo?: string;
  manufacturer: string; 
  from: string;
  to: string;
  fromName: string;
  toName: string;
  departureTime: string;
  arrivalTime: string;
  gate?:string;
  durationMinutes: number;
  baseFare: {
    economy?: number;
    premium_economy?: number;
    business?: number;
    first?: number;
  };
  baggageRules: {
    freeCabinKg: number;
    extraChargePerKg: number;
    maxExtraKg?: number;
  };
   amenities?: string[];  
  foodMenuIds: string[];
}

export interface BookingSegmentCacheDTO {
  sessionId: string;
  userId: string;
  passengerCount: number;
  segments: BookingSegmentFlightDTO[];
  createdAt: string;
}

export interface BookingDetailsPassengerSeatDTO {
  flightId: string;
  flightSeatId: string;
  seatNumber: string;
  cabinClass: string;
  position: string;
  baseFare: number;
  seatSurcharge: number;
  luggageCharge: number;
  segmentFare: number;
}

export interface BookingDetailsPassengerDTO {
  passengerId: string;
  name: string;
  dob: string;
  gender: "male" | "female" | "other";
  address: string;
  mobile: string;
  extraLuggageKg: number;
  seats: BookingDetailsPassengerSeatDTO[];
}

export interface BookingDetailsFoodItemDTO {
  foodId: string;
  foodName: string;
  foodPrice: number;
  quantity: number;
  itemTotal: number;
}

export interface BookingDetailsFlightFoodDTO {
  flightId: string;
  items: BookingDetailsFoodItemDTO[];
  flightFoodTotal: number;
}

export interface BookingFareBreakdownSegmentDTO {
  flightId: string;
  flightNumber: string;
  from: string;
  to: string;
  seatNumber: string;
  cabinClass: string;
  baseFare: number;
  seatSurcharge: number;
  luggageCharge: number;
  segmentFare: number;
}

export interface BookingFareBreakdownPassengerDTO {
  passengerId: string;
  passengerName: string;
  perSegment: BookingFareBreakdownSegmentDTO[];
  passengerTotal: number;
}

export interface BookingFareBreakdownDTO {
  passengerFares: BookingFareBreakdownPassengerDTO[];
  foodTotal: number;
  subtotal: number;
  discount: number;
  grandTotal: number;
  offerId?: string;
offerCode?: string;
discountPercentage?: number;
}

export interface BookingDetailsCacheDTO {
  sessionId: string;
  userId: string;
  passengers: BookingDetailsPassengerDTO[];
  flightFoods: BookingDetailsFlightFoodDTO[];
  fareBreakdown: BookingFareBreakdownDTO;
  createdAt: string;
}

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface AddFlightToSegmentDTO {
  flightId: string;
  passengerCount: number;
  sessionId?: string;
}

export interface UpdatePassengerCountDTO {
  passengerCount: number;
}

export interface RemoveFlightFromSegmentDTO {
  flightId: string;
}

// ─── Response DTOs ───────────────────────────────────────────────────────────

export interface BookingSegmentResponseDTO {
  sessionId: string;
  passengerCount: number;
  segments: BookingSegmentFlightDTO[];
  createdAt: string;
}

export interface BookingPassengerSegmentResponseDTO {
  flightId: string;
  flightNumber: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  flightSeatId: string;
  seatNumber: string;
  cabinClass: string;
  position: string;
  baseFare: number;
  seatSurcharge: number;
  luggageCharge: number;
  segmentFare: number;
  status: "active" | "cancelled";
  cancelledAt?: string;
}

export interface BookingPassengerResponseDTO {
  passengerId: string;
  name: string;
  dob: string;
  gender: "male" | "female" | "other";
  address: string;
  mobile: string;
  extraLuggageKg: number;
  segments: BookingPassengerSegmentResponseDTO[];
  passengerTotal: number;
  status: "active" | "cancelled";
  cancelledAt?: string;
  refundAmount?: number;
}

export interface BookingFlightFoodResponseDTO {
  flightId: string;
  aircraftId: string;
  items: {
    foodId: string;
    foodName: string;
    foodPrice: number;
    quantity: number;
    itemTotal: number;
  }[];
  flightFoodTotal: number;
}

export interface BookingResponseDTO {
  id: string;
  userId: string;
  segments: BookingSegmentSummaryDTO[]; 
  passengers: BookingPassengerResponseDTO[];
  flightFoods: BookingFlightFoodResponseDTO[];
  subtotal: number;
  discount: number;
  grandTotal: number;
  status: "pending" | "confirmed" | "payment_failed" | "cancelled";
  paymentIntentId?: string;
  paymentConfirmedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingSegmentSummaryDTO {
  flightId: string;
  flightNumber: string;
  aircraftName: string;
  providerName: string;
  providerLogo?: string;
  manufacturer: string;
  from: string;
  fromName: string;
  to: string;
  toName: string;
  departureTime: string;
  arrivalTime: string;
  gate?: string;
  durationMinutes: number;
  baggageRules: {
    freeCabinKg: number;
    extraChargePerKg: number;
    maxExtraKg?: number;
  };
}

export interface BookingSummaryResponseDTO {
  sessionId: string;
  segments: BookingSegmentFlightDTO[]; 
  passengers: BookingDetailsPassengerDTO[];
  flightFoods: BookingDetailsFlightFoodDTO[];
  fareBreakdown: BookingFareBreakdownDTO;
  createdAt: string;
}
export interface UpdateBookingSegmentDTO {
  passengerCount?: number;
  removeFlightId?: string;
}
export interface BookingFlightSeatMapDTO {
  flightId: string;
  flightNumber: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  availableSeatCount: number;
  hasWarning: boolean;
  seatMap: FlightSeatMapDTO[];
}

export interface BookingSeatsMapResponseDTO {
  sessionId: string;
  passengerCount: number;
  flights: BookingFlightSeatMapDTO[];
}
export interface SeatLockDTO {
  flightId: string;
  flightSeatId: string;
  passengerId: string;
}

export interface SeatLockResponseDTO {
  flightSeatId: string;
  seatNumber: string;
  flightId: string;
  passengerId: string;
  lockedUntil: string;
}
export interface SaveBookingDetailsDTO {
  passengers: {
    passengerId: string;
    name: string;
    dob: string;
    gender: "male" | "female" | "other";
    address: string;
    mobile: string;
    extraLuggageKg: number;
    seats: {
      flightId: string;
      flightSeatId: string;
    }[];
  }[];
  flightFoods: {
    flightId: string;
    items: {
      foodId: string;
      quantity: number;
    }[];
  }[];
}

export interface InitiateBookingDTO {
  sessionId: string;
  offerId?: string;
}

export interface InitiateBookingResponseDTO {
  bookingId: string;
  clientSecret: string;
  amount: number;
}

export interface RetryPaymentResponseDTO {
  bookingId: string;
  clientSecret: string;
  amount: number;
}

export interface CancelPassengerResponseDTO {
  bookingId: string;
  passengerId: string;
  refundAmount: number;
  walletBalance: number;
}

export interface BookingListItemDTO {
  id: string;
  userId: string;
  segments: {
    flightId: string;
    flightNumber: string;
    from: string;
    to: string;
    departureTime: string;
    arrivalTime: string;
  }[];
  passengers: BookingPassengerResponseDTO[];
  flightFoods: BookingFlightFoodResponseDTO[];
  subtotal: number;
  discount: number;
  grandTotal: number;
  status: "pending" | "confirmed" | "payment_failed" | "cancelled";
  paymentIntentId?: string;
  paymentConfirmedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// provider booking details of each passenger

export interface ProviderBookingPassengerDTO {
  passengerId: string;
  name: string;
  gender: "male" | "female" | "other";
  dob: string;
  mobile: string;
  status: "active" | "cancelled";
  segments: BookingPassengerSegmentResponseDTO[];
  passengerTotal: number;
}

export interface ProviderBookingDetailResponseDTO {
  id: string;
  status: "pending" | "confirmed" | "payment_failed" | "cancelled";
  paymentConfirmedAt?: string;
  createdAt: string;
  segments: {
    flightId: string;
    flightNumber: string;
    from: string;
    to: string;
    departureTime: string;
    arrivalTime: string;
  }[];
  passengers: ProviderBookingPassengerDTO[];
  flightFoods: BookingFlightFoodResponseDTO[];
  grossAmount: number;
  commissionAmount: number;
  providerRevenue: number;
  grandTotal: number;
}