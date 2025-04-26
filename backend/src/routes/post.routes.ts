import express from "express";
import {
  createPost,
  deletePost,
  getPost,
  getUserPosts,
  updatePost,
} from "../controllers/post.controller";
import { protect, publicRoute } from "../middlewares/auth.middleware";

const router = express.Router();

// Apply cache middleware to GET routes
router.get("/user", protect, getUserPosts);
router.get("/:id", publicRoute, getPost);

router.post("/save", protect, createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

export default router;
