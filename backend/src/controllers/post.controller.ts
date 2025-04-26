import { Request, Response } from "express";
import Post, { IPost } from "../models/post.model";
import { AppError } from "../middlewares/error.middleware";
import mongoose from "mongoose";

// Create a new post
export const createPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, content } = req.body;

    // Validate input
    if (!title || !content) {
      throw new AppError("Please provide title and content", 400);
    }

    if (!req.user) {
      throw new AppError("User not found", 401);
    }

    // Create post
    const post = await Post.create({
      title,
      content,
      author: req.user.id,
    });

    // Send response
    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    // Pass error to error handler
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

    // Find posts by author ID
    const posts = await Post.find({ author: req.user.id }).sort({
      createdAt: -1,
    });

    // Send response
    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    // Pass error to error handler
    throw error;
  }
};

// Get a single post by ID
export const getPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new AppError("Invalid post ID", 400);
    }

    // Find post
    const post = await Post.findById(postId);

    // Check if post exists
    if (!post) {
      throw new AppError("Post not found", 404);
    }

    // Send response
    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    // Pass error to error handler
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

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new AppError("Invalid post ID", 400);
    }

    if (!req.user) {
      throw new AppError("User not found", 401);
    }

    // Find post
    const post = (await Post.findById(postId)) as IPost | null;

    // Check if post exists
    if (!post) {
      throw new AppError("Post not found", 404);
    }

    // Check if user is the author - cast post.author to string for comparison
    const authorId =
      post.author instanceof mongoose.Types.ObjectId
        ? post.author.toString()
        : String(post.author);

    if (authorId !== req.user.id) {
      throw new AppError("Not authorized to update this post", 403);
    }

    // Update post
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, content },
      { new: true, runValidators: true }
    );

    // Send response
    res.status(200).json({
      success: true,
      data: updatedPost,
    });
  } catch (error) {
    // Pass error to error handler
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

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new AppError("Invalid post ID", 400);
    }

    if (!req.user) {
      throw new AppError("User not found", 401);
    }

    // Find post
    const post = (await Post.findById(postId)) as IPost | null;

    // Check if post exists
    if (!post) {
      throw new AppError("Post not found", 404);
    }

    // Check if user is the author - cast post.author to string for comparison
    const authorId =
      post.author instanceof mongoose.Types.ObjectId
        ? post.author.toString()
        : String(post.author);

    if (authorId !== req.user.id) {
      throw new AppError("Not authorized to delete this post", 403);
    }

    // Delete post
    await Post.findByIdAndDelete(postId);

    // Send response
    res.status(200).json({
      success: true,
      data: {},
      message: "Post deleted successfully",
    });
  } catch (error) {
    // Pass error to error handler
    throw error;
  }
};
