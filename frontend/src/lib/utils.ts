import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Post } from "./store";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// API response interface for MongoDB documents
export interface ApiResponse {
  success?: boolean;
  data?: {
    _id?: string;
    id?: string;
    title: string;
    content?: string;
    author?: string;
    published?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
  _id?: string;
  id?: string;
  title?: string;
  content?: string;
  author?: string;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Converts MongoDB document format to frontend Post format
 * Handles both nested response format and direct document format
 */
export const formatPostData = (data: ApiResponse): Post => {
  // If the data is in the nested format with success and data properties
  if (data && data.success && data.data) {
    const postData = data.data;
    return {
      id: postData._id || postData.id,
      title: postData.title || "",
      content: postData.content || "",
      author: postData.author,
      published: postData.published,
      createdAt: postData.createdAt,
      updatedAt: postData.updatedAt,
    };
  }
  // If the data is directly the post object with _id
  else if (data && (data._id || data.id)) {
    return {
      id: data._id || data.id,
      title: data.title || "",
      content: data.content || "",
      author: data.author,
      published: data.published,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
  // Return a default empty post if data is invalid
  return {
    id: "",
    title: "",
    content: "",
  };
};
