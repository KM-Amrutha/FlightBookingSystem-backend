import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";

import app from "@server";
import connectDB from "@infrastructure/config/db.config";
import { connectRedis } from "@infrastructure/config/redis.config";
import { startBookingCleanupJob } from "@shared/utils/booking-cleanup";
import { bookingRepository, flightSeatRepository } from "@di/container-resolver";
import { createServer } from "http";

connectDB();
connectRedis();
startBookingCleanupJob(bookingRepository, flightSeatRepository);
const httpServer = createServer(app);

const PORT = process.env.PORT;

if (!PORT) {
  console.error("Port is not defined in .env file");
  process.exit(1);
}

httpServer.listen(PORT, () => {
  console.log(`Server running on the port ${PORT}`);
});