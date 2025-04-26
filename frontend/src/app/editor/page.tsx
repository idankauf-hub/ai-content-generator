"use client";

import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { getPost, createPost, updatePost, generateContent } from "@/lib/api";
import { usePostStore, Post } from "@/lib/store";
import { GenerationParams, AuthStatus, isAxiosError } from "@/lib/types";
import { formatPostData } from "@/lib/utils";
import { Layout } from "@/components/layout";
import { useQueryClient } from "@tanstack/react-query";

export default function EditorPage() {
    const { status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const postId = searchParams.get("id");
    const isEditing = !!postId;
    const queryClient = useQueryClient();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [topic, setTopic] = useState("");
    const [style, setStyle] = useState("");
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const { setCurrentPost } = usePostStore();

    // Redirect if not authenticated
    useEffect(() => {
        if (status === AuthStatus.Unauthenticated) {
            router.push("/login");
        }
    }, [status, router]);

    // Fetch post if editing
    useEffect(() => {
        async function fetchPost() {
            if (postId && status === AuthStatus.Authenticated) {
                try {
                    setLoading(true);
                    const response = await getPost(postId);

                    // Format the post data to ensure it matches our frontend structure
                    const formattedPost = formatPostData(response);
                    console.log("Loaded post for editing:", formattedPost);

                    // Set the form fields with the post data
                    setTitle(formattedPost.title || '');
                    setContent(formattedPost.content || '');
                    setCurrentPost(formattedPost);
                } catch (error) {
                    console.error("Error fetching post:", error);
                    toast.error("Failed to load post");
                } finally {
                    setLoading(false);
                }
            }
        }

        fetchPost();
    }, [postId, status, setCurrentPost]);

    const handleSave = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!title || !content) {
            toast.error("Title and content are required");
            return;
        }

        try {
            setLoading(true);
            const postData: Post = {
                title,
                content,
            };

            let result;
            if (isEditing && postId) {
                result = await updatePost({ ...postData, id: postId });
                toast.success("Post updated successfully");
            } else {
                result = await createPost(postData);
                toast.success("Post created successfully");
            }

            // Format the result to ensure it matches our frontend structure
            const formattedResult = formatPostData(result);
            setCurrentPost(formattedResult);

            // Invalidate the posts query to force a refetch when returning to dashboard
            queryClient.invalidateQueries({ queryKey: ['posts'] });

            // Redirect to dashboard
            router.push("/dashboard");
        } catch (error) {
            console.error("Error saving post:", error);
            if (isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Failed to save post");
            } else {
                toast.error("Failed to save post");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        if (!topic || !style) {
            toast.error("Please enter a topic and writing style");
            return;
        }

        try {
            setGenerating(true);
            const params: GenerationParams = { topic, style };
            const result = await generateContent(params);

            setTitle(result.title || topic);
            setContent(result.content);
            toast.success("Content generated successfully");
        } catch (error) {
            console.error("Error generating content:", error);
            if (isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Failed to generate content");
            } else {
                toast.error("Failed to generate content");
            }
        } finally {
            setGenerating(false);
        }
    };

    if (status === AuthStatus.Loading || (loading && isEditing)) {
        return (
            <Layout>
                <div className="flex min-h-[80vh] items-center justify-center">Loading...</div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto py-8 max-w-4xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">{isEditing ? "Edit Post" : "Create New Post"}</h1>
                    <Button onClick={() => router.push("/dashboard")} variant="outline">
                        Back to Dashboard
                    </Button>
                </div>

                <Card className="mb-8">
                    <CardContent className="pt-6">
                        <form onSubmit={handleSave} className="space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium mb-2">
                                    Title
                                </label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                                    placeholder="Enter post title"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="content" className="block text-sm font-medium mb-2">
                                    Content
                                </label>
                                <Textarea
                                    id="content"
                                    value={content}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                                    placeholder="Write your post content here..."
                                    className="min-h-[300px]"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={loading}>
                                    {loading ? "Saving..." : "Save Post"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <h2 className="text-xl font-semibold mb-4">Generate Content with AI</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="topic" className="block text-sm font-medium mb-2">
                                    Topic
                                </label>
                                <Input
                                    id="topic"
                                    value={topic}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTopic(e.target.value)}
                                    placeholder="Enter a topic (e.g., 'The Future of AI')"
                                />
                            </div>
                            <div>
                                <label htmlFor="style" className="block text-sm font-medium mb-2">
                                    Writing Style
                                </label>
                                <Input
                                    id="style"
                                    value={style}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStyle(e.target.value)}
                                    placeholder="Enter a style (e.g., 'Professional', 'Casual', 'Academic')"
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    onClick={handleGenerate}
                                    disabled={generating}
                                    variant="secondary"
                                >
                                    {generating ? "Generating..." : "Generate Content"}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
} 