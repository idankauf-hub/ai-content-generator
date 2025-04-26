import { Request, Response, NextFunction } from "express";
import redisClient from "../config/redis";

// Cache duration in seconds
const CACHE_DURATION = 60 * 15; // 15 minutes

/**
 * Middleware to cache API responses in Redis
 * @param duration Cache duration in seconds (defaults to 15 minutes)
 */
export const cacheMiddleware = (duration: number = CACHE_DURATION) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip caching for non-GET requests
    if (req.method !== "GET") {
      return next();
    }

    // Create a cache key from the request URL
    const cacheKey = `cache:${req.originalUrl}`;

    try {
      // Check if data exists in cache
      const cachedData = await redisClient.get(cacheKey);

      if (cachedData) {
        // Return cached data
        return res.json(JSON.parse(cachedData));
      }

      // Store the original res.json method
      const originalJson = res.json;

      // Override res.json method to cache the response
      res.json = function (data) {
        // Cache the response data
        redisClient
          .setEx(cacheKey, duration, JSON.stringify(data))
          .catch((err: Error) => console.error("Redis cache error:", err));

        // Call the original json method
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      console.error("Redis cache middleware error:", error);
      next(); // Continue without caching
    }
  };
};
