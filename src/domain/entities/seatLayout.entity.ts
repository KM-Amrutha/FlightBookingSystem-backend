export interface ISeatLayout extends Document {
  _id: string;
  aircraftId: string;
  cabinClass: string; // "economy" | "business" | "first"
  rowsConfiguration: string; // "3-3", "2-4-2", "3-3-3"
  startRow: number;
  endRow: number;
  totalRows: number;
  seatsPerRow: number;
  aisleColumns: string[]; // ["C-D"] for 3-3 layout
  wingStartRow: number;
  wingEndRow: number;
}