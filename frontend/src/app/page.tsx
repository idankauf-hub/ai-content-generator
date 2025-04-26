"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function HomePage() {
  const { status } = useSession();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b">
        <div className="container mx-auto flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold">AI Content Generator</h1>
          <div className="flex gap-4">
            {status === "authenticated" ? (
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto text-center">
            <h2 className="text-5xl font-bold mb-6">Generate Amazing Content with AI</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Create high-quality blog posts, articles, and stories powered by artificial intelligence.
              Save time and boost your creativity.
            </p>
            <Button size="lg" asChild>
              <Link href={status === "authenticated" ? "/editor" : "/signup"}>
                Start Creating
              </Link>
            </Button>
          </div>
        </section>

        <section className="py-16 container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Input Your Topic</h3>
              <p className="text-gray-600">
                Specify the topic and writing style for your content.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Generates Content</h3>
              <p className="text-gray-600">
                Our advanced AI creates a high-quality blog post tailored to your specifications.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Edit & Share</h3>
              <p className="text-gray-600">
                Refine the content if needed, then share it with your audience.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Create Amazing Content?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Sign up today and start generating AI-powered blog posts in minutes.
            </p>
            <Button size="lg" asChild>
              <Link href={status === "authenticated" ? "/dashboard" : "/signup"}>
                Get Started
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
