import mongoose from "mongoose";
import Post, { IPost } from "../models/post.model";
import { AppError } from "../middlewares/error.middleware";

interface CreatePostParams {
  title: string;
  content: string;
  userId: string;
}

interface UpdatePostParams {
  title: string;
  content: string;
}

export const createPost = async (params: CreatePostParams): Promise<IPost> => {
  const { title, content, userId } = params;

  if (!title || !content) {
    throw new AppError("Please provide title and content", 400);
  }

  if (!userId) {
    throw new AppError("User not found", 401);
  }

  const post = await Post.create({
    title,
    content,
    author: userId,
  });

  return post;
};

export const getUserPosts = async (userId: string): Promise<IPost[]> => {
  if (!userId) {
    throw new AppError("User not found", 401);
  }

  const posts = await Post.find({ author: userId }).sort({
    createdAt: -1,
  });

  return posts;
};

export const getPostById = async (postId: string): Promise<IPost> => {
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new AppError("Invalid post ID", 400);
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  return post;
};

export const updatePost = async (
  postId: string,
  userId: string,
  params: UpdatePostParams
): Promise<IPost> => {
  const { title, content } = params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new AppError("Invalid post ID", 400);
  }

  if (!userId) {
    throw new AppError("User not found", 401);
  }

  const post = (await Post.findById(postId)) as IPost | null;

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const authorId =
    post.author instanceof mongoose.Types.ObjectId
      ? post.author.toString()
      : String(post.author);

  if (authorId !== userId) {
    throw new AppError("Not authorized to update this post", 403);
  }

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { title, content },
    { new: true, runValidators: true }
  );

  if (!updatedPost) {
    throw new AppError("Failed to update post", 500);
  }

  return updatedPost;
};

export const deletePost = async (
  postId: string,
  userId: string
): Promise<void> => {
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new AppError("Invalid post ID", 400);
  }

  if (!userId) {
    throw new AppError("User not found", 401);
  }

  const post = (await Post.findById(postId)) as IPost | null;

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const authorId =
    post.author instanceof mongoose.Types.ObjectId
      ? post.author.toString()
      : String(post.author);

  if (authorId !== userId) {
    throw new AppError("Not authorized to delete this post", 403);
  }

  await Post.findByIdAndDelete(postId);
};
