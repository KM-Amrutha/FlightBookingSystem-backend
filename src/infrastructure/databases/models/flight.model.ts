import { IFlight } from "@domain/entities/flight.entity";
import mongoose, { Schema } from "mongoose";

const flightSchema: Schema = new Schema({
   aircraftName: { type: String, 
    required: true
   },
  flightId: { type: String,
     required: true, 
     unique: true 
    },
  flightNumber: { type: String,
     required: true 
    },
  providerId: { type: mongoose.Schema.Types.ObjectId,
     ref: 'Provider', 
     required: true 
    },
  aircraftId: { type: mongoose.Schema.Types.ObjectId,
     ref: 'Aircraft',
      required: true 
    },
  seatLayoutId: { type: mongoose.Schema.Types.ObjectId,
     ref: 'SeatLayout',
      // required: true
     },
  departureDestinationId: { type: mongoose.Schema.Types.ObjectId,
     ref: 'Destination', 
     required: true 
    },
  arrivalDestinationId: { type: mongoose.Schema.Types.ObjectId,
     ref: 'Destination', 
     required: true 
    },
  departureTime: { type: Date, 
    required: true
   },
  arrivalTime: { type: Date,
     required: true 
    },
  durationMinutes: { type: Number, 
    required: true
   },
  gate: { type: String 

  },
  baseFare: {
    economy: Number,
    premiumEconomy: Number,
    business: Number,
    first: Number
  },
  seatSurcharge: {
    window: Number,
    aisle: Number,
    extraLegroom: Number
  },
  baggageRules: {
    freeCabinKg: { type: Number, default: 7 },
    extraChargePerKg: { type: Number, required: true },
    maxExtraKg: Number
  },
  luggageRuleId: { type: mongoose.Schema.Types.ObjectId, 
    ref: 'LuggageRule'
   },
  foodMenuId: [{ type: mongoose.Schema.Types.ObjectId,
     ref: 'FoodMenu' }],
  flightStatus: { type: String,
     enum: ['scheduled', 'cancelled', 'completed'], 
     default: 'scheduled' 
    },
  adminApproval: {
    status: { type: String, enum: ['pending', 'approved', 'rejected'], 
      default: 'pending' },
    reviewedAt: Date,
    reason: String
  }
}, 
{ timestamps: true }

);

flightSchema.index({ flightNumber: 1 });
flightSchema.index({ providerId: 1 });
flightSchema.index({ departureTime: 1 });
flightSchema.index({ departureDestinationId: 1, arrivalDestinationId: 1 });
flightSchema.index({ status: 1 });

const FlightModel = mongoose.model<IFlight>("Flight", flightSchema);
export default FlightModel;
