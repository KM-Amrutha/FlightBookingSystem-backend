export interface ITicket {
  id: string;
  bookingId: string;
  userId: string;
  ticketNumber: string;
  passengerIndex: number;
  flightIndex: number;
  issuedAt: Date;
  passenger: ITicketPassenger;
  
  flightFood?: ITicketFlightFood;
  fareBreakdown: {
    subtotal: number;
    discount: number;
    grandTotal: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ITicketPassenger {
  passengerId: string;
  name: string;
  dob: Date;
  gender: "male" | "female" | "other";
  mobile: string;
  segment: ITicketPassengerSegment;
  segmentTotal: number;
}

export interface ITicketFlightFood {
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

export interface ITicketPassengerSegment {
  flightId: string;
  flightNumber: string;
  from: string;
  fromName: string;
  to: string;
  toName: string;
  departureTime: Date;
  arrivalTime: Date;
  seatNumber: string;
  cabinClass: string;
  position: string;
  baseFare: number;
  seatSurcharge: number;
  luggageCharge: number;
  segmentFare: number;
  providerName: string;
  providerLogo?: string;
  amenities?: string[];
  aircraftName: string;
  manufacturer: string;
  gate?: string;
  durationMinutes: number;
  baggageRules: {
    freeCabinKg: number;
    extraChargePerKg: number;
    maxExtraKg?: number;
  };
}



