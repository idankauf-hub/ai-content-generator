"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AuthStatus } from "@/lib/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function Header() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut({ redirect: false });
            toast.success("Logged out successfully");
            router.push("/login");
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Failed to log out");
        }
    };

    return (
        <header className="border-b">
            <div className="container mx-auto py-4 px-4 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">AI Content Generator</Link>

                <nav className="flex items-center gap-4">
                    {status === AuthStatus.Authenticated ? (
                        <>
                            <Link href="/dashboard">Dashboard</Link>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">
                                    {session?.user?.name || session?.user?.email}
                                </span>
                                <Button variant="outline" size="sm" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </div>
                        </>
                    ) : status === AuthStatus.Unauthenticated ? (
                        <div className="flex gap-2">
                            <Button asChild variant="outline" size="sm">
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button asChild size="sm">
                                <Link href="/signup">Sign Up</Link>
                            </Button>
                        </div>
                    ) : null}
                </nav>
            </div>
        </header>
    );
} 