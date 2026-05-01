
// import { IBookingPassengerSegment } from "./booking.entity";
export interface IPassenger {
  passengerId: string;
  name: string;
  dob: Date;
  gender: "male" | "female" | "other";
  address: string;
  mobile: string;
  extraLuggageKg: number;
  // segments: IBookingPassengerSegment[];
  passengerTotal: number;
  status: "active" | "cancelled";
  cancelledAt?: Date;
  refundAmount?: number;
}