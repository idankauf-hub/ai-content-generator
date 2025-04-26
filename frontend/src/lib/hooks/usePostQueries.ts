import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Post } from "../types";

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
    staleTime: 10 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const posts = postsData?.data || ([] as Post[]);

  return {
    posts,
    postsData,
    isLoading,
    postsError,
    refetch,
  };
}

export function useSinglePostQuery(postId: string | null) {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      if (!postId) return null;
      const response = await getPost(postId);
      return response;
    },
    enabled: !!postId,
  });
}

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
    onError: () => {
      toast.error("Failed to create post");
    },
  });
}

export function useUpdatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postData: Post) => {
      const response = await updatePost(postData);
      return response;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", variables._id] });
      toast.success("Post updated successfully");
    },
    onError: () => {
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
    onError: () => {
      toast.error("Failed to delete post");
    },
  });

  return mutation;
}
