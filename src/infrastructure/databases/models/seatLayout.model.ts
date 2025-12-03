import mongoose, { Schema, model } from "mongoose";
import { ISeatLayout } from "@domain/entities/seatLayout.entity";

const seatLayoutSchema = new Schema<ISeatLayout>(
  {
    aircraftId: {
      type: String,
      required: [true, "Aircraft ID is required"],
      ref: "Aircraft",
      index: true
    },
    cabinClass: {
      type: String,
      required: [true, "Cabin class is required"],
      lowercase: true,
      enum: {
        values: ["economy", "premium_economy", "business", "first"],
        message: "{VALUE} is not a valid cabin class"
      }
    },
    layout: {
      type: String,
      required: [true, "Layout is required"],
      match: [/^\d+-\d+(-\d+)?$/, "Format must be like 3-3 or 2-4-2 or 1-2-1"]
    },
    startRow: {
      type: Number,
      required: [true, "Start row is required"],
      min: 1
    },
    endRow: {
      type: Number,
      required: [true, "End row is required"],
      min: 1,
      validate: {
        validator: function(this: ISeatLayout, value: number) {
          return value >= this.startRow;
        },
        message: "End row must be greater than or equal to start row"
      }
    },
    totalRows: {
      type: Number,
      required: [false, "total row is not required"],
      min: 1
    },
    seatsPerRow: {
      type: Number,
      required: [true, "Seats per row is required"],
      min: [1, "Must have at least 1 seat per row"],
      max: [12, "Cannot exceed 12 seats per row"]
    },
    columns: {
      type: [String],
      required: [true, "Columns are required"],
      validate: {
        validator: function(arr: string[]) {
          return arr.length > 0 && arr.every(val => /^[A-K]$/.test(val));
        },
        message: "Columns must be array of single letters A-K"
      }
    },
    aisleColumns: {
      type: [String],
      default: [],
      validate: {
        validator: function(arr: string[]) {
          return arr.every(val => /^[A-K]-[A-K]$/.test(val));
        },
        message: "Aisle columns must be in format like C-D"
      }
    },
    exitRows: {
      type: [Number],
      default: []
    },
    wingStartRow: {
      type: Number,
      default: 0
    },
    wingEndRow: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

seatLayoutSchema.index({ aircraftId: 1, cabinClass: 1 }, { unique: true });
seatLayoutSchema.index({ aircraftId: 1 });

seatLayoutSchema.pre("save", function(next) {
  if (this.startRow && this.endRow) {
    this.totalRows = this.endRow - this.startRow + 1;
  }
  next();
});

const SeatLayout = model<ISeatLayout>("SeatLayout", seatLayoutSchema);
export default SeatLayout;
