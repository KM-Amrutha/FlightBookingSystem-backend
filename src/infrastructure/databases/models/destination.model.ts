import { IDestination } from "@domain/entities/destination.entity";
import mongoose, { Schema } from "mongoose";

const destinationSchema = new Schema<IDestination>(
  {
    name: { 
      type: String, 
      required: true,
      trim: true 
    },
    iataCode: { 
      type: String, 
      required: true, 
      uppercase: true,
      trim: true,
      maxlength: 3
    },
    icaoCode: { 
      type: String,
      uppercase: true,
      trim: true,
      maxlength: 4
    },
    municipality: { 
      type: String, 
      required: true,
      trim: true 
    },
    isoCountry: { 
      type: String, 
      required: true,
      uppercase: true,
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
    },
    timezone: { 
      type: String, 
      required: true 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    }
  },
  { timestamps: true }
);

// Indexes for fast queries
destinationSchema.index({ iataCode: 1 });
destinationSchema.index({ name: "text", municipality: "text", isoCountry: "text" });
destinationSchema.index({ isActive: 1 });

const DestinationModel = mongoose.model<IDestination>("Destination", destinationSchema);

export default DestinationModel;
