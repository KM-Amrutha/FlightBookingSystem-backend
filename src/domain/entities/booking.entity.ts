export interface IBooking {
  id: string;
  userId: string;
  segments: {
    flightId: string;
    flightNumber: string;
    from: string;
    to: string;
    departureTime: Date;
    arrivalTime: Date;
  }[];
  passengers: IBookingPassenger[];
  flightFoods: IBookingFlightFood[];
  subtotal: number;
  discount: number;
  grandTotal: number;
  status: "pending" | "confirmed" | "payment_failed" | "cancelled";
  paymentIntentId?: string;
  paymentConfirmedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBookingPassengerSegment {
  flightId: string;
  flightNumber: string;
  from: string;
  to: string;
  departureTime: Date;
  arrivalTime: Date;
  flightSeatId: string;
  seatNumber: string;
  cabinClass: string;
  position: string;
  baseFare: number;
  seatSurcharge: number;
  luggageCharge: number;
  segmentFare: number;
  status: "active" | "cancelled";
  cancelledAt?: Date;
}

export interface IBookingPassenger {
  passengerId: string;
  name: string;
  dob: Date;
  gender: "male" | "female" | "other";
  address: string;
  mobile: string;
  extraLuggageKg: number;
  segments: IBookingPassengerSegment[];
  passengerTotal: number;
  status: "active" | "cancelled";
  cancelledAt?: Date;
  refundAmount?: number;
}

export interface IBookingFlightFood {
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

