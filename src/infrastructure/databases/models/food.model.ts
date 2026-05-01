import mongoose, { Schema } from "mongoose";

const foodSchema: Schema = new Schema(
  {
    aircraftId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Aircraft",
      required: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },
    foodName: {
      type: String,
      required: true,
      trim: true,
    },
    foodType: {
      type: String,
      required: true,
      trim: true,
    },
    vegNonveg: {
      type: String,
      enum: ["veg", "non-veg"],
      required: true,
    },
    serveMethod: {
      type: String,
      required: true,
      trim: true,
    },
    isComplimentary: {
      type: Boolean,
      default: false,
    },
    foodPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

foodSchema.index({ aircraftId: 1 });
foodSchema.index({ providerId: 1 });
foodSchema.index({ aircraftId: 1, isActive: 1 });

const FoodModel = mongoose.model("Food", foodSchema);
export default FoodModel;