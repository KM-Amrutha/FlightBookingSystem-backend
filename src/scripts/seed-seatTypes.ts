import mongoose from "mongoose";
import SeatType from "../infrastructure/databases/models/seatType.model";
import dotenv from "dotenv";

dotenv.config();

const seatTypes = [
  {
    seatTypeName: "Economy",
    cabinClass: "economy",
    basePriceMultiplier: 1.0,
    seatPitch: 31,
    seatWidth: 17,
    features: ["standard", "tray-table", "overhead-storage"]
  },
  {
    seatTypeName: "Premium Economy",
    cabinClass: "premium_economy",
    basePriceMultiplier: 1.5,
    seatPitch: 38,
    seatWidth: 18.5,
    features: [
      "extra-legroom",
      "priority-boarding",
      "meal-included",
      "power-outlet",
      "upgraded-amenity-kit"
    ]
  },
  {
    seatTypeName: "Business",
    cabinClass: "business",
    basePriceMultiplier: 3.0,
    seatPitch: 76,
    seatWidth: 21,
    features: [
      "flat-bed",
      "direct-aisle-access",
      "priority-boarding",
      "lounge-access",
      "premium-meal",
      "power-outlet",
      "entertainment-system",
      "extra-storage"
    ]
  },
  {
    seatTypeName: "First",
    cabinClass: "first",
    basePriceMultiplier: 6.0,
    seatPitch: 80,
    seatWidth: 23,
    features: [
      "private-suite",
      "flat-bed",
      "direct-aisle-access",
      "priority-boarding",
      "lounge-access",
      "gourmet-meal",
      "chauffeur-service",
      "power-outlet",
      "entertainment-system",
      "shower",
      "bar-access"
    ]
  }
];

const seedSeatTypes = async (): Promise<void> => {
  try {
    const MONGO_URI = process.env.ATLAS_DATABASE_CONFIG || "mongodb://localhost:27017/airticket";
    
    await mongoose.connect(MONGO_URI);


    await SeatType.insertMany(seatTypes);
    await mongoose.connection.close();
   
    process.exit(0);
  } catch (error) {

    await mongoose.connection.close();
    process.exit(1);
  }
};

seedSeatTypes();
