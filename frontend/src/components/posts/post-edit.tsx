"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Post } from "@/lib/types";
import { toast } from "sonner";

interface PostEditProps {
    post: Post;
    onUpdate: (content: string) => void;
}

export function PostEdit({ post, onUpdate }: PostEditProps) {
    const [content, setContent] = useState(post.content || "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) {
            toast.error("Content cannot be empty");
            return;
        }

        try {
            setIsSubmitting(true);
            onUpdate(content);
        } catch (error) {
            console.error("Error updating post:", error);
            toast.error("Failed to update post");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
                <h2 className="text-xl font-bold">Edit Post</h2>
                <p className="text-sm text-muted-foreground">{post.title}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="content" className="text-sm font-medium leading-none">
                        Content
                    </label>
                    <Textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Edit your post content..."
                        className="min-h-32"
                        required
                    />
                </div>
                <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Updating..." : "Update Post"}
                    </Button>
                </div>
            </form>
        </div>
    );
} 