"use client";

import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { usePostsQuery, useDeletePostMutation } from "@/lib/hooks/usePostQueries";

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

    useEffect(() => {
        if (!session) {
            router.push("/");
        }
    }, [session, router]);

    // Use the custom hook for fetching posts
    const { posts, isLoading, postsError, refetch } = usePostsQuery(!!session);

    // Use the custom hook for deleting posts
    const deletePostMutation = useDeletePostMutation();

    // Ensure fresh data when coming back to this page
    useEffect(() => {
        refetch();
    }, [refetch]);

    const handleDelete = (postId: string) => {
        if (!postId) {
            toast.error("Invalid post ID");
            return;
        }
        setIsDeleting(postId);
        deletePostMutation.mutate(postId, {
            onSuccess: () => {
                setIsDeleting(null);
            },
            onError: () => {
                setIsDeleting(null);
            }
        });
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



