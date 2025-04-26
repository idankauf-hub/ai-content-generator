import { create } from "zustand";
import { Post } from "./types";

// Frontend Post format

interface PostStore {
  posts: Post[];
  currentPost: Post | null;
  loading: boolean;
  error: string | null;
  setPosts: (mongoPosts: Post[] | Post[]) => void;
  setCurrentPost: (post: Post | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addPost: (post: Post) => void;
  updatePost: (updatedPost: Post) => void;
  deletePost: (postId: string) => void;
}

// Helper function to convert MongoDB document to frontend format
const convertMongoPost = (mongoPost: Post): Post => ({
  _id: mongoPost._id,
  title: mongoPost.title,
  content: mongoPost.content,
  author: mongoPost.author,
  published: mongoPost.published,
  createdAt: mongoPost.createdAt,
  updatedAt: mongoPost.updatedAt,
});

export const usePostStore = create<PostStore>((set) => ({
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  setPosts: (mongoPosts) => {
    // Check if these are MongoDB documents (have _id) or already-converted posts
    if (mongoPosts.length > 0 && "_id" in mongoPosts[0]) {
      // Convert MongoDB documents to our format
      const convertedPosts = (mongoPosts as Post[]).map(convertMongoPost);
      set({ posts: convertedPosts });
    } else {
      // Already in our format
      set({ posts: mongoPosts as Post[] });
    }
  },
  setCurrentPost: (post) => set({ currentPost: post }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  addPost: (post) =>
    set((state) => {
      // Check if the post already exists in the array
      const postExists = state.posts.some(
        (p) => post._id && p._id === post._id
      );

      if (postExists) {
        // Update the post instead of adding a duplicate
        return {
          posts: state.posts.map((p) =>
            post._id && p._id === post._id ? post : p
          ),
        };
      }

      // Add the new post
      return { posts: [...state.posts, post] };
    }),
  updatePost: (updatedPost) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post._id && updatedPost._id && post._id === updatedPost._id
          ? updatedPost
          : post
      ),
      currentPost:
        state.currentPost?._id &&
        updatedPost._id &&
        state.currentPost._id === updatedPost._id
          ? updatedPost
          : state.currentPost,
    })),
  deletePost: (postId) =>
    set((state) => ({
      posts: state.posts.filter((post) => post._id !== postId),
      currentPost: state.currentPost?._id === postId ? null : state.currentPost,
    })),
}));
