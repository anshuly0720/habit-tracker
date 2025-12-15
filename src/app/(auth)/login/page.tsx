"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { Flame } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password");
                return;
            }

            router.push("/dashboard");
            router.refresh();
        } catch {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px]" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                        <Flame className="w-7 h-7 text-white" />
                    </div>
                    <span className="font-bold text-2xl gradient-text">HabitFlow</span>
                </div>

                <Card className="p-8">
                    <h1 className="text-2xl font-bold text-white text-center mb-2">
                        Welcome back
                    </h1>
                    <p className="text-zinc-400 text-center mb-8">
                        Sign in to continue to your dashboard
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                            }
                            required
                        />

                        {error && (
                            <p className="text-danger text-sm bg-danger/10 border border-danger/30 rounded-lg px-4 py-3">
                                {error}
                            </p>
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            isLoading={isLoading}
                            className="w-full"
                        >
                            Sign In
                        </Button>
                    </form>

                    <p className="text-center text-zinc-400 text-sm mt-6">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/register"
                            className="text-primary-light hover:text-primary transition-colors"
                        >
                            Sign up
                        </Link>
                    </p>
                </Card>
            </div>
        </div>
    );
}
