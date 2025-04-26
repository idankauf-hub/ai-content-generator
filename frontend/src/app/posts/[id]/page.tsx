"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { getPost } from "@/lib/api";
import { Post } from "@/lib/store";
import Link from "next/link";
import { formatPostData } from "@/lib/utils";
import { isAxiosError } from "@/lib/types";
import { Layout } from "@/components/layout";

export default function PostPage() {
    const params = useParams();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPost() {
            try {
                setLoading(true);
                const postId = params.id as string;
                const response = await getPost(postId);

                const formattedPost = formatPostData(response);
                setPost(formattedPost);
            } catch (error) {
                console.error("Error fetching post:", error);
                if (isAxiosError(error)) {
                    setError(error.response?.data?.message || "Failed to load post. It may not exist or has been removed.");
                } else {
                    setError("Failed to load post. It may not exist or has been removed.");
                }
                toast.error("Failed to load post");
            } finally {
                setLoading(false);
            }
        }

        fetchPost();
    }, [params.id]);

    if (loading) {
        return (
            <Layout>
                <div className="flex min-h-[80vh] items-center justify-center">Loading...</div>
            </Layout>
        );
    }

    if (error || !post) {
        return (
            <Layout>
                <div className="container mx-auto py-12 max-w-4xl text-center">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Post Not Found</h1>
                    <p className="text-gray-600 mb-8">{error || "The post you're looking for doesn't exist."}</p>
                    <Button asChild>
                        <Link href="/">Go to Home</Link>
                    </Button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto py-8 max-w-4xl">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl">{post.title}</CardTitle>
                        <div className="text-sm text-gray-500">
                            {post.createdAt && (
                                <p>
                                    Published on {new Date(post.createdAt).toLocaleDateString()} at{" "}
                                    {new Date(post.createdAt).toLocaleTimeString()}
                                </p>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="prose prose-lg max-w-none">
                            {post.content && post.content.split("\n").map((paragraph, index) => (
                                <p key={index} className="mb-4">
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        <div className="mt-12 border-t pt-6">
                            <p className="text-sm text-gray-500 italic">
                                This content was generated using AI technology.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
} 