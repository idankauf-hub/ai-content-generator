import { Request, Response } from "express";
import { AppError } from "../middlewares/error.middleware";
import * as postService from "../services/post.service";

// Create a new post
export const createPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, content } = req.body;

    if (!req.user) {
      throw new AppError("User not found", 401);
    }

    const post = await postService.createPost({
      title,
      content,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    throw error;
  }
};

// Get all posts by current user
export const getUserPosts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("User not found", 401);
    }

    const posts = await postService.getUserPosts(req.user.id);

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    throw error;
  }
};

// Get a single post by ID
export const getPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.id;
    const post = await postService.getPostById(postId);

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    throw error;
  }
};

// Update a post
export const updatePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const postId = req.params.id;
    const { title, content } = req.body;

    if (!req.user) {
      throw new AppError("User not found", 401);
    }

    const updatedPost = await postService.updatePost(postId, req.user.id, {
      title,
      content,
    });

    res.status(200).json({
      success: true,
      data: updatedPost,
    });
  } catch (error) {
    throw error;
  }
};

// Delete a post
export const deletePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const postId = req.params.id;

    if (!req.user) {
      throw new AppError("User not found", 401);
    }

    await postService.deletePost(postId, req.user.id);

    res.status(200).json({
      success: true,
      data: {},
      message: "Post deleted successfully",
    });
  } catch (error) {
    throw error;
  }
};
