import { ILuggage } from "@domain/entities/luggage.entity";
import mongoose, { Schema } from "mongoose";

const luggageSchema: Schema = new Schema(
  {
    passengerId: {
      type: String,
      required: true,
      ref: "Passenger"
    },
    isWeightAbove7kg: {
      type: Boolean,
      required: true,
      default: false
    },
    isWeightAbove20kg: {
      type: Boolean,
      required: true,
      default: false
    },
    extraCharge7kg: {
      type: Number,
      default: 0,
      min: 0
    },
    extraCharge20kg: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { timestamps: true }
);

luggageSchema.index({ passengerId: 1 });

const LuggageModel = mongoose.model<ILuggage>("Luggage", luggageSchema);
export default LuggageModel;
