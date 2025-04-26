import axios from "axios";
import { getSession } from "next-auth/react";
import { Post, GenerationParams } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(async (config) => {
  const session = await getSession();

  if (session?.user?.accessToken) {
    config.headers.Authorization = `Bearer ${session.user.accessToken}`;
  } else {
    console.log("No access token found in session");
  }

  return config;
});

// Authentication
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const response = await api.post("/auth/signup", { name, email, password });
    return response.data;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

// Posts
export const getPosts = async () => {
  try {
    console.log("Fetching posts from:", `${API_URL}/posts/user`);
    const response = await api.get("/posts/user");
    console.log("Posts response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const getPost = async (id: string) => {
  try {
    if (!id) {
      throw new Error("Post ID is required");
    }
    const response = await api.get(`/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    throw error;
  }
};

export const createPost = async (post: Omit<Post, "_id">) => {
  try {
    const response = await api.post("/posts/save", post);
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const updatePost = async (post: Post) => {
  try {
    // Get the post ID
    const postId = post._id;
    if (!postId) {
      throw new Error("Post ID is required for updates");
    }

    console.log("Updating post with ID:", postId);
    console.log("Update payload:", {
      title: post.title,
      content: post.content,
    });

    const response = await api.put(`/posts/${postId}`, {
      title: post.title,
      content: post.content,
    });

    console.log("Update response:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating post:`, error);
    throw error;
  }
};

export const deletePost = async (id: string) => {
  try {
    if (!id) {
      throw new Error("Post ID is required for deletion");
    }
    console.log("Deleting post with ID:", id);
    const response = await api.delete(`/posts/${id}`);
    console.log("Delete response:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error deleting post ${id}:`, error);
    throw error;
  }
};

// AI Generation
export const generateContent = async (params: GenerationParams) => {
  const response = await api.post("/generate", params);
  return response.data.data;
};

export default api;
