export const SEAT_MESSAGES = {
  INVALID_LAYOUT: (valid: string[]) => `Invalid layout. Valid layouts: ${valid.join(", ")}`,
  INVALID_CABIN_CLASS: (valid: string[]) => `Invalid cabin class. Valid classes: ${valid.join(", ")}`,
  LAYOUT_ALREADY_EXISTS: (cabinClass: string) => `Seat layout for ${cabinClass} class already exists for this aircraft`,
  ROW_RANGE_OVERLAP: (s: number, e: number, cls: string, ls: number, le: number) =>
    `Row range ${s}-${e} overlaps with existing ${cls} layout (rows ${ls}-${le})`,
  WING_ROWS_OUT_OF_RANGE: "Wing rows must be within the layout row range",
  WING_ROW_START_AFTER_END: "Wing start row cannot be greater than wing end row",
  EXIT_ROW_OUT_OF_RANGE: (row: number, s: number, e: number) =>
    `Exit row ${row} is outside the layout row range ${s}-${e}`,
  SEAT_CAPACITY_EXCEEDED: (projected: number, capacity: number) =>
    `Total seats (${projected}) would exceed aircraft capacity (${capacity})`,
  LAYOUT_CONFIG_NOT_FOUND: (layout: string) => `Layout configuration not found for ${layout}`,
  ROW_NUMBER_MIN: "Row numbers must be at least 1",
  START_ROW_AFTER_END_ROW: "Start row cannot be greater than end row",NO_LAYOUTS_FOUND: "No seat layouts found. Create seat layouts first before generating seats.",
INVALID_LAYOUT_CONFIG: (layout: string) => `Invalid layout configuration: ${layout}`,
SEAT_TYPE_NOT_FOUND_FOR_CLASS: (cabinClass: string) => `Seat type not found for class: ${cabinClass}`,
NO_SEATS_GENERATED: "No seats generated. Check your layout configuration.",
} as const;