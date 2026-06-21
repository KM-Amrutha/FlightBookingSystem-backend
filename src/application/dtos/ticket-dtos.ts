export interface TicketPassengerSegmentResponseDTO {
  flightId: string;
  flightNumber: string;
  from: string;
  fromName: string;
  to: string;
  toName: string;
  departureTime: string;
  arrivalTime: string;
  seatNumber: string;
  cabinClass: string;
  position: string;
  baseFare: number;
  seatSurcharge: number;
  luggageCharge: number;
  segmentFare: number;
  providerName: string;
  providerLogo?: string;
  aircraftName: string;
  manufacturer: string;
  amenities?: string[];
  gate?: string;
  durationMinutes: number;
  baggageRules: {
    freeCabinKg: number;
    extraChargePerKg: number;
    maxExtraKg?: number;
  };
}

export interface TicketPassengerResponseDTO {
  passengerId: string;
  name: string;
  dob: string;
  gender: "male" | "female" | "other";
  mobile: string;
  segment: TicketPassengerSegmentResponseDTO;
  segmentTotal: number;
}

export interface TicketFlightFoodResponseDTO {
  flightId: string;
  flightNumber: string;
  items: {
    foodName: string;
    foodPrice: number;
    quantity: number;
    itemTotal: number;
  }[];
  flightFoodTotal: number;
}

export interface TicketResponseDTO {
  id: string;
  bookingId: string;
  userId: string;
  ticketNumber: string;
  passengerIndex: number;
  flightIndex: number;
  issuedAt: string;
  passenger: TicketPassengerResponseDTO;
  flightFood?: TicketFlightFoodResponseDTO;
  fareBreakdown: {
    subtotal: number;
    discount: number;
    grandTotal: number;
  };
  createdAt: string;
  updatedAt: string;
}