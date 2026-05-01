export interface IBookingDetails {
  sessionId: string;
  userId: string;
  passengers: {
    passengerId: string;    // uuid — frontend generated
    name: string;
    dob: string;            // ISO date string
    gender: "male" | "female" | "other";
    address: string;
    mobile: string;
    extraLuggageKg: number; // same across all flights for this passenger
    seats: {
      flightId: string;
      flightSeatId: string;
      seatNumber: string;
      cabinClass: string;
      position: string;     // window | middle | aisle
      baseFare: number;
      seatSurcharge: number;
      luggageCharge: number;
      segmentFare: number;  // baseFare + seatSurcharge + luggageCharge
    }[];
  }[];
  flightFoods: {            // per flight, not per passenger
    flightId: string;
    items: {
      foodId: string;
      foodName: string;
      foodPrice: number;
      quantity: number;
      itemTotal: number;    // foodPrice × quantity
    }[];
    flightFoodTotal: number;
  }[];
  fareBreakdown: {
    passengerFares: {
      passengerId: string;
      passengerName: string;
      perSegment: {
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
      }[];
      passengerTotal: number;
    }[];
    foodTotal: number;      // sum of all flightFoodTotals
    subtotal: number;       // sum of all passengerTotals + foodTotal
    discount: number;       // 0 for now, offer system later
    grandTotal: number;
  };
  createdAt: string;
}