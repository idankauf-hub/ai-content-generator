"use client";

import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateContent } from "@/lib/api";
import { useCreatePostMutation, useSinglePostQuery, useUpdatePostMutation } from "@/lib/hooks/usePostQueries";
import { Post, usePostStore } from "@/lib/store";
import { AuthStatus, isAxiosError } from "@/lib/types";
import { formatPostData } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditorPage() {
    const { status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const postId = searchParams.get("id");
    const isEditing = !!postId;

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [topic, setTopic] = useState("");
    const [style, setStyle] = useState("");
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const { setCurrentPost } = usePostStore();

    const { data: postData, isLoading: isLoadingPost } = useSinglePostQuery(postId);
    const createPostMutation = useCreatePostMutation();
    const updatePostMutation = useUpdatePostMutation();

    useEffect(() => {
        if (status === AuthStatus.Unauthenticated) {
            router.push("/login");
        }
    }, [status, router]);

    useEffect(() => {
        if (postData && isEditing) {
            const formattedPost = formatPostData(postData);
            setTitle(formattedPost.title || '');
            setContent(formattedPost.content || '');
            setCurrentPost(formattedPost);
        }
    }, [postData, isEditing, setCurrentPost]);

    const handleSave = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!title || !content) {
            toast.error("Title and content are required");
            return;
        }

        const postData: Post = {
            title,
            content,
        };

        try {
            setLoading(true);

            if (isEditing && postId) {
                await updatePostMutation.mutateAsync({ ...postData, id: postId });
            } else {
                await createPostMutation.mutateAsync(postData);
            }

            router.push("/dashboard");
        } catch (error) {
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
            toast.error("Topic and style are required");
            return;
        }

        try {
            setGenerating(true);
            const response = await generateContent({ topic, style });
        } catch (error) {
            console.error("Error generating content:", error);
            toast.error("Failed to generate content");
        } finally {
            setGenerating(false);
        }
    };


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