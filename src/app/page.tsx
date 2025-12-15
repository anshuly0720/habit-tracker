import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Flame, Target, Users, Trophy, ArrowRight, Sparkles } from "lucide-react";

export default async function HomePage() {
    const session = await auth();

    if (session?.user) {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background gradient effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px]" />
                <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[150px]" />
            </div>

            {/* Navigation */}
            <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                        <Flame className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-bold text-xl gradient-text">HabitFlow</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        href="/login"
                        className="px-4 py-2 text-zinc-300 hover:text-white transition-colors"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/register"
                        className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-all shadow-lg shadow-primary/25"
                    >
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
                <div className="text-center max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary-light text-sm mb-8">
                        <Sparkles className="w-4 h-4" />
                        Build habits that stick
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        Track Your Habits,
                        <br />
                        <span className="gradient-text">Transform Your Life</span>
                    </h1>

                    <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
                        Build better habits with social accountability. Track your progress,
                        compete with friends, and become the best version of yourself.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/register"
                            className="group flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-semibold text-lg transition-all shadow-xl shadow-primary/30"
                        >
                            Start Your Journey
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/login"
                            className="px-8 py-4 text-zinc-300 hover:text-white transition-colors font-medium"
                        >
                            Already have an account?
                        </Link>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-6 mt-32">
                    <div className="group p-8 bg-surface/50 backdrop-blur-sm border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all">
                        <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Target className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-3">
                            Track Daily Habits
                        </h3>
                        <p className="text-zinc-400">
                            Create daily or weekly habits and track your progress with beautiful
                            visualizations and streak counters.
                        </p>
                    </div>

                    <div className="group p-8 bg-surface/50 backdrop-blur-sm border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all">
                        <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Users className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-3">
                            Social Accountability
                        </h3>
                        <p className="text-zinc-400">
                            Follow friends, see their activity feed, and stay motivated with
                            social accountability features.
                        </p>
                    </div>

                    <div className="group p-8 bg-surface/50 backdrop-blur-sm border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all">
                        <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Trophy className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-3">
                            Compete & Win
                        </h3>
                        <p className="text-zinc-400">
                            Climb the leaderboard, build streaks, and compete with your friends
                            to stay on top of your goals.
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-zinc-800 py-8">
                <div className="max-w-7xl mx-auto px-6 text-center text-zinc-500 text-sm">
                    © 2024 HabitFlow. Built with ❤️ for habit builders.
                </div>
            </footer>
        </div>
    );
}
