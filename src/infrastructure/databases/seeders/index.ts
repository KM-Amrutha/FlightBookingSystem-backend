import { seedSeatTypes } from "./seatType.seeder";
import { seedDestinations } from "./destination.seeder";

export const runSeeders = async () => {
  await seedDestinations();
  await seedSeatTypes(); 
};
