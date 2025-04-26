import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "@/lib/api";
import { Post } from "@/lib/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Hook for fetching all posts
export function usePostsQuery(enabled = true) {
  const {
    data: postsData,
    isLoading,
    error: postsError,
    refetch,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const response = await getPosts();
        return response;
      } catch (error) {
        console.error("Error fetching posts:", error);
        throw new Error("Failed to fetch posts");
      }
    },
    enabled,
    staleTime: 10 * 1000, // Consider data fresh for 10 seconds
    refetchOnWindowFocus: true, // Refetch when window gains focus
    refetchOnMount: true, // Refetch when component mounts
  });

  // Extract posts from the data structure
  const posts = postsData?.data || [];

  return {
    posts,
    postsData,
    isLoading,
    postsError,
    refetch,
  };
}

// Hook for fetching a single post
export function useSinglePostQuery(postId: string | null) {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      if (!postId) return null;
      const response = await getPost(postId);
      return response;
    },
    enabled: !!postId, // Only run if postId exists
  });
}

// Hook for creating a post
export function useCreatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postData: Omit<Post, "id">) => {
      const response = await createPost(postData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post created successfully");
    },
    onError: (error) => {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    },
  });
}

// Hook for updating a post
export function useUpdatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postData: Post) => {
      const response = await updatePost(postData);
      return response;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["post", variables._id] });
      toast.success("Post updated successfully");
    },
    onError: (error) => {
      console.error("Error updating post:", error);
      toast.error("Failed to update post");
    },
  });
}

// Hook for deleting a post
export function useDeletePostMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (postId: string) => {
      console.log("Deleting post in mutation:", postId);
      await deletePost(postId);
      return postId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    },
  });

  return mutation;
}
