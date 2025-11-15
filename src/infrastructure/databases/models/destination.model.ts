import { IDestination } from "@domain/entities/destination.entity";
import mongoose, { Schema } from "mongoose";

const destinationSchema: Schema = new Schema(
  {
    airportCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: 3
    },
    airportName: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    },
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180
    }
  },
  { timestamps: true }
);

destinationSchema.index({ airportCode: 1 });
destinationSchema.index({ city: 1, country: 1 });

const DestinationModel = mongoose.model<IDestination>("Destination", destinationSchema);
export default DestinationModel;
