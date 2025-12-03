export interface SeatLayoutConfig {
  seatsPerRow: number;
  columns: string[];
  aisleColumns: string[];
  positions: Record<string, "window" | "middle" | "aisle">;
}

export const PREDEFINED_SEAT_LAYOUTS: Record<string, SeatLayoutConfig> = {
  "2-2": {
    seatsPerRow: 4,
    columns: ["A", "B", "C", "D"],
    aisleColumns: ["B-C"],
    positions: { A: "window", B: "aisle", C: "aisle", D: "window" }
  },
  "2-3-2": {
    seatsPerRow: 7,
    columns: ["A", "B", "C", "D", "E", "F", "G"],
    aisleColumns: ["C-D"],
    positions: {
      A: "window", B: "middle", C: "aisle", D: "aisle", E: "middle", F: "middle", G: "window"
    }
  },
  "2-4-2": {
    seatsPerRow: 8,
    columns: ["A", "B", "C", "D", "E", "F", "G", "H"],
    aisleColumns: ["B-C", "F-G"],
    positions: {
      A: "window", B: "aisle", C: "aisle", D: "middle",
      E: "middle", F: "aisle", G: "aisle", H: "window"
    }
  },
  "3-3": {
    seatsPerRow: 6,
    columns: ["A", "B", "C", "D", "E", "F"],
    aisleColumns: ["C-D"],
    positions: {
      A: "window", B: "middle", C: "aisle", D: "aisle", E: "middle", F: "window"
    }
  },
  "3-3-3": {
    seatsPerRow: 9,
    columns: ["A", "B", "C", "D", "E", "F", "G", "H", "J"],
    aisleColumns: ["C-D", "F-G"],
    positions: {
      A: "window", B: "middle", C: "aisle", D: "aisle", E: "middle",
      F: "aisle", G: "aisle", H: "middle", J: "window"
    }
  }
};

export const getLayoutConfig = (layout: string): SeatLayoutConfig | null => {
  return PREDEFINED_SEAT_LAYOUTS[layout] || null;
};

export const getValidLayouts = (): string[] => {
  return Object.keys(PREDEFINED_SEAT_LAYOUTS);
};
