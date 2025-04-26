"use client";

import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { deletePost, getPosts } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Define a MongoDB post structure that could come from the API
interface MongoDBPost {
    _id: string;
    id?: string;
    title: string;
    content: string;
    createdAt?: string;
    updatedAt?: string;
    author?: string;
    published?: boolean;
}

export default function DashboardPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!session) {
            router.push("/");
        }
    }, [session, router]);

    // React Query for fetching posts with refetching options
    const {
        data: postsData,
        isLoading,
        error: postsError,
        refetch
    } = useQuery({
        queryKey: ['posts'],
        queryFn: async () => {
            try {
                console.log("Fetching posts in dashboard page");
                const response = await getPosts();
                console.log("Response from getPosts:", response);
                return response;
            } catch (e) {
                console.error("Error fetching posts:", e);
                throw new Error("Failed to fetch posts");
            }
        },
        enabled: !!session,
        staleTime: 10 * 1000, // Consider data fresh for 10 seconds
        refetchOnWindowFocus: true, // Refetch when window gains focus
        refetchOnMount: true // Refetch when component mounts
    });

    // Ensure fresh data when coming back to this page
    useEffect(() => {
        refetch();
    }, [refetch]);

    // Extract posts from the data structure
    const posts = postsData?.data || [];

    console.log('Raw data from API:', postsData);
    console.log('Processed posts array:', posts);

    // Mutation for deleting a post
    const deletePostMutation = useMutation({
        mutationFn: async (postId: string) => {
            console.log("Deleting post in mutation:", postId);
            await deletePost(postId);
            return postId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            toast.success("Post deleted successfully");
            setIsDeleting(null);
        },
        onError: (error) => {
            console.error("Delete post error:", error);
            toast.error("Failed to delete post");
            setIsDeleting(null);
        }
    });

    const handleDelete = (postId: string) => {
        if (!postId) {
            toast.error("Invalid post ID");
            return;
        }
        console.log('Deleting post with ID:', postId);
        setIsDeleting(postId);
        deletePostMutation.mutate(postId);
    };

    if (!session) {
        return null;
    }

    return (
        <Layout>
            <div className="container mx-auto py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Your Content</h1>
                    <Button asChild>
                        <Link href="/editor">Create New Post</Link>
                    </Button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">Loading posts...</div>
                ) : postsError ? (
                    <div className="text-center py-12 text-red-500">{String(postsError)}</div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">You haven&apos;t created any posts yet.</p>
                        <Button asChild>
                            <Link href="/editor">Create Your First Post</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post: MongoDBPost) => (
                            <Card key={post._id} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle className="line-clamp-1">{post.title}</CardTitle>
                                    <CardDescription>
                                        {new Date(post.createdAt || Date.now()).toLocaleDateString()}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="line-clamp-3 text-gray-600">{post.content?.substring(0, 150) || ''}...</p>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button variant="outline" asChild>
                                        <Link href={`/editor?id=${post._id}`}>Edit</Link>
                                    </Button>
                                    <div className="flex gap-2">
                                        <Button variant="outline" asChild>
                                            <Link href={`/posts/${post._id}`}>View</Link>
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={() => handleDelete(post._id)}
                                            disabled={isDeleting === post._id}
                                        >
                                            {isDeleting === post._id ? "Deleting..." : "Delete"}
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}



