export interface ISeatType {
  id: string;
  seatTypeName: string; // "Economy", "Premium Economy", "Business", "First"
  cabinClass: string; // "economy" | "premium_economy" | "business" | "first"
  basePriceMultiplier: number;
  seatPitch: number; //  legroom in inches
  seatWidth: number; // width in inches
  features: string[];
  createdAt: Date;
  updatedAt: Date; 
}
