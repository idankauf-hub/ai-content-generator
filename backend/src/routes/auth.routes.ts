import express from "express";
import { signup, login, getCurrentUser } from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protected routes
router.get("/me", protect, getCurrentUser);

export default router;
