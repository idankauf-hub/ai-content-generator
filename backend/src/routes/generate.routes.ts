import express from "express";
import { generateAIContent } from "../controllers/generate.controller";
import { protect } from "../middlewares/auth.middleware";
import { cacheMiddleware } from "../middlewares/cache.middleware";

const router = express.Router();

// Protected route - generation requires authentication
router.post("/", protect, generateAIContent);

export default router;
