 import Redis from "ioredis";
const REDIS_HOST = process.env.REDIS_HOST!;
const REDIS_PORT = parseInt(process.env.REDIS_PORT!);

if (!REDIS_HOST || !REDIS_PORT) {
  console.error("Redis configuration is missing in .env");
  process.exit(1);
}

const redisClient = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  lazyConnect: true,
});

export const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
    console.log("Redis connected successfully");
  } catch (error) {
    console.error("Error connecting to Redis:", error);
    process.exit(1);
  }
};

export default redisClient;