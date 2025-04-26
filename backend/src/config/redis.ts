import { createClient } from "redis";
import { env } from "./environment";

// Create Redis client
const redisClient = createClient({
  url: env.redis_url || "redis://redis:6379",
});

// Connect to Redis
export const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
    console.log("Redis client connected");
  } catch (error: unknown) {
    console.error("Redis connection error:", error);
    // Retry connection after delay
    setTimeout(connectRedis, 5000);
  }
};

// Error handling
redisClient.on("error", (error: Error) => {
  console.error("Redis error:", error);
});

export default redisClient;
