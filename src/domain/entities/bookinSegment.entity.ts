export interface IBookingSegment {
  sessionId: string;
  userId: string;
  passengerCount: number;
  segments: {
    flightId: string;
    flightNumber: string;
    from: string;        // iataCode
    to: string;          // iataCode
    fromName: string;    // destination name
    toName: string;
    departureTime: string;  // ISO
    arrivalTime: string;    // ISO
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
    foodMenuIds: string[];   // IFoods._id refs
  }[];
  createdAt: string;
}