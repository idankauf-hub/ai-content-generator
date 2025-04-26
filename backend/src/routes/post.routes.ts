import express from "express";
import {
  createPost,
  getUserPosts,
  getPost,
  updatePost,
  deletePost,
} from "../controllers/post.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

// Protected routes - all post routes require authentication
router.use(protect);

// Post routes
router.post("/save", createPost);
router.get("/user", getUserPosts);
router.get("/:id", getPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

export default router;
