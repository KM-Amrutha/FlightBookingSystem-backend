import { injectable } from "inversify";
import redisClient from "@infrastructure/config/redis.config";
import { IRedisService } from "@application/interfaces/service/cache/IRedis.service";

@injectable()
export class RedisService implements IRedisService {
    
  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    await redisClient.set(key, JSON.stringify(value), "EX", ttlSeconds);
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await redisClient.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  }

  async delete(key: string): Promise<void> {
    await redisClient.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await redisClient.exists(key);
    return result === 1;
  }
}