"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import HabitCard from "@/components/habits/HabitCard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import {
    Plus,
    Flame,
    Target,
    TrendingUp,
    Calendar,
    Loader2,
} from "lucide-react";

interface Habit {
    id: string;
    name: string;
    category: string;
    frequency: "DAILY" | "WEEKLY";
    currentStreak: number;
    longestStreak: number;
    completionRate: number;
    isCompletedToday: boolean;
    totalCompletions: number;
}

interface Stats {
    totalHabits: number;
    activeHabits: number;
    totalCurrentStreak: number;
    bestStreak: number;
    totalCompletions: number;
    overallCompletionRate: number;
}

export default function DashboardPage() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const [habitsRes, statsRes] = await Promise.all([
                fetch("/api/habits"),
                fetch("/api/stats"),
            ]);

            if (habitsRes.ok) {
                const habitsData = await habitsRes.json();
                setHabits(habitsData);
            }

            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData.stats);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleComplete = async (id: string) => {
        try {
            const res = await fetch(`/api/habits/${id}/complete`, { method: "POST" });
            const data = await res.json();

            if (!res.ok) {
                toast(data.error || "Failed to complete habit", "error");
                return;
            }

            toast("🎉 Habit completed!", "success");
            fetchData();
        } catch {
            toast("An error occurred", "error");
        }
    };

    const handleUncomplete = async (id: string) => {
        try {
            const res = await fetch(`/api/habits/${id}/complete`, { method: "DELETE" });
            const data = await res.json();

            if (!res.ok) {
                toast(data.error || "Failed to undo completion", "error");
                return;
            }

            toast("Completion undone", "info");
            fetchData();
        } catch {
            toast("An error occurred", "error");
        }
    };

    const handleDelete = async (id: string) => {
        const res = await fetch(`/api/habits/${id}`, { method: "DELETE" });

        if (!res.ok) {
            throw new Error("Failed to delete habit");
        }

        fetchData();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    const completedToday = habits.filter((h) => h.isCompletedToday).length;
    const todayProgress = habits.length > 0
        ? Math.round((completedToday / habits.length) * 100)
        : 0;

    return (
        <div className="max-w-6xl mx-auto space-y-6 lg:space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white">Dashboard</h1>
                    <p className="text-zinc-400 mt-1 text-sm lg:text-base">Track your habits and build streaks</p>
                </div>
                <Link href="/habits/new">
                    <Button variant="primary" size="md" className="w-full sm:w-auto">
                        <Plus className="w-5 h-5" />
                        New Habit
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                <Card className="flex items-center gap-3 lg:gap-4 p-4 lg:p-6">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Target className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xl lg:text-2xl font-bold text-white">
                            {stats?.totalHabits || 0}
                        </p>
                        <p className="text-xs lg:text-sm text-muted truncate">Total Habits</p>
                    </div>
                </Card>

                <Card className="flex items-center gap-3 lg:gap-4 p-4 lg:p-6">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                        <Flame className="w-5 h-5 lg:w-6 lg:h-6 text-orange-400" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xl lg:text-2xl font-bold text-white">
                            {stats?.totalCurrentStreak || 0}
                        </p>
                        <p className="text-xs lg:text-sm text-muted truncate">Active Streaks</p>
                    </div>
                </Card>

                <Card className="flex items-center gap-3 lg:gap-4 p-4 lg:p-6">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-green-400" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xl lg:text-2xl font-bold text-white">
                            {stats?.overallCompletionRate || 0}%
                        </p>
                        <p className="text-xs lg:text-sm text-muted truncate">Completion</p>
                    </div>
                </Card>

                <Card className="flex items-center gap-3 lg:gap-4 p-4 lg:p-6">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-blue-400" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xl lg:text-2xl font-bold text-white">
                            {stats?.totalCompletions || 0}
                        </p>
                        <p className="text-xs lg:text-sm text-muted truncate">Check-ins</p>
                    </div>
                </Card>
            </div>

            {/* Today's Progress */}
            <Card className="p-4 lg:p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base lg:text-lg font-semibold text-white">Today&apos;s Progress</h2>
                    <span className="text-xs lg:text-sm text-muted">
                        {completedToday} of {habits.length} completed
                    </span>
                </div>
                <div className="h-3 bg-surface-light rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-primary to-purple-400 transition-all duration-500"
                        style={{ width: `${todayProgress}%` }}
                    />
                </div>
                <p className="text-center text-xl lg:text-2xl font-bold text-white mt-4">
                    {todayProgress}%
                </p>
            </Card>

            {/* Habits List */}
            <div>
                <h2 className="text-lg lg:text-xl font-semibold text-white mb-4">Your Habits</h2>

                {habits.length === 0 ? (
                    <Card className="text-center py-8 lg:py-12 p-4 lg:p-6">
                        <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 rounded-full bg-surface-light flex items-center justify-center">
                            <Target className="w-6 h-6 lg:w-8 lg:h-8 text-muted" />
                        </div>
                        <h3 className="text-base lg:text-lg font-semibold text-white mb-2">
                            No habits yet
                        </h3>
                        <p className="text-zinc-400 mb-6 text-sm lg:text-base">
                            Create your first habit to start tracking your progress
                        </p>
                        <Link href="/habits/new">
                            <Button variant="primary">
                                <Plus className="w-4 h-4" />
                                Create Your First Habit
                            </Button>
                        </Link>
                    </Card>
                ) : (
                    <div className="grid gap-3 lg:gap-4">
                        {habits.map((habit) => (
                            <HabitCard
                                key={habit.id}
                                habit={habit}
                                onComplete={handleComplete}
                                onUncomplete={handleUncomplete}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
