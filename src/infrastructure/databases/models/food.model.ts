import { IFoods } from "@domain/entities/food.entity";
import mongoose, { Schema } from "mongoose";

const foodsSchema: Schema = new Schema(
  {
    aircraftType: {
      type: String,
      required: true,
      trim: true
    },
    foodType: {
      type: String,
      required: true,
      enum: ["meal", "snack", "beverage", "dessert"]
    },
    foodName: {
      type: String,
      required: true,
      trim: true
    },
    vegNonveg: {
      type: String,
      required: true,
      enum: ["veg", "non-veg", "vegan"]
    },
    serveMethod: {
      type: String,
      required: true,
      enum: ["hot", "cold", "ambient"]
    },
    isComplimentary: {
      type: Boolean,
      required: true,
      default: false
    },
    foodPrice: {
      type: Number,
      required: true,
      min: 0
    },
    addImage: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

foodsSchema.index({ aircraftType: 1 });
foodsSchema.index({ foodType: 1 });
foodsSchema.index({ vegNonveg: 1 });

const FoodsModel = mongoose.model<IFoods>("Foods", foodsSchema);
export default FoodsModel;
