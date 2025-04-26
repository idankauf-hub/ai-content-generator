"use client";

import { Layout } from "@/components/layout";
import { Suspense } from "react";
import EditorContent from "./editor-content";

export default function EditorPage() {
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <Layout>
                    <EditorContent />
                </Layout>
            </Suspense>
        </div>
    );
} 