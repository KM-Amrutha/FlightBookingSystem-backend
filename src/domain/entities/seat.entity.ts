export interface ISeat  {
  id: string;
  aircraftId: string;
  seatTypeId: string;
  cabinClass?: string;
  seatNumber: string; // "12A", "15F"
  rowNumber: number; // 12
  columnPosition: string; // "A"
  section: string; // "front" | "middle" | "rear" | "overwing"
  position: string; // "window" | "middle" | "aisle"
  isExitRow: boolean;
  isBlocked: boolean;
  blockReason?: string; 
  features: string[]; // ["extra legroom", "power outlet"]
  createdAt: Date;
  updatedAt: Date; 

   seatTypeName?: string;
  
}
