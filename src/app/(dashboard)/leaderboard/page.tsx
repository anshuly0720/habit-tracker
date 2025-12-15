"use client";

import { useEffect, useState, useCallback } from "react";
import Card from "@/components/ui/Card";
import { Trophy, Flame, Medal, Crown, Loader2 } from "lucide-react";

interface LeaderboardUser {
    id: string;
    username: string;
    rank: number;
    totalCurrentStreak: number;
    bestStreak: number;
    habitCount: number;
    totalCompletions: number;
    followerCount: number;
    isCurrentUser: boolean;
}

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLeaderboard = useCallback(async () => {
        try {
            const res = await fetch("/api/leaderboard");
            if (res.ok) {
                const data = await res.json();
                setLeaderboard(data);
            }
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLeaderboard();
    }, [fetchLeaderboard]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Crown className="w-6 h-6 text-yellow-400" />;
            case 2:
                return <Medal className="w-6 h-6 text-zinc-300" />;
            case 3:
                return <Medal className="w-6 h-6 text-orange-400" />;
            default:
                return (
                    <span className="w-6 h-6 flex items-center justify-center text-muted font-bold">
                        {rank}
                    </span>
                );
        }
    };

    const getRankBg = (rank: number) => {
        switch (rank) {
            case 1:
                return "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30";
            case 2:
                return "bg-gradient-to-r from-zinc-400/20 to-zinc-500/20 border-zinc-400/30";
            case 3:
                return "bg-gradient-to-r from-orange-500/20 to-amber-500/20 border-orange-500/30";
            default:
                return "";
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <Trophy className="w-8 h-8 text-yellow-400" />
                    <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
                </div>
                <p className="text-zinc-400">
                    Compete with others and climb to the top!
                </p>
            </div>

            {/* Top 3 Podium */}
            {leaderboard.length >= 3 && (
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {/* Second Place */}
                    <div className="mt-8">
                        <Card className={`text-center py-6 ${getRankBg(2)}`}>
                            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-zinc-400 to-zinc-500 flex items-center justify-center">
                                <span className="text-2xl font-bold text-white">
                                    {leaderboard[1].username.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <Medal className="w-6 h-6 text-zinc-300 mx-auto mb-2" />
                            <h3 className="font-semibold text-white truncate px-2">
                                {leaderboard[1].username}
                            </h3>
                            <p className="text-2xl font-bold text-white mt-2 flex items-center justify-center gap-1">
                                {leaderboard[1].totalCurrentStreak}
                                <Flame className="w-5 h-5 text-orange-400" />
                            </p>
                            <p className="text-xs text-muted">Total Streak</p>
                        </Card>
                    </div>

                    {/* First Place */}
                    <div>
                        <Card className={`text-center py-8 ${getRankBg(1)}`}>
                            <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center ring-4 ring-yellow-400/30">
                                <span className="text-3xl font-bold text-white">
                                    {leaderboard[0].username.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                            <h3 className="font-semibold text-white text-lg truncate px-2">
                                {leaderboard[0].username}
                            </h3>
                            <p className="text-3xl font-bold text-white mt-2 flex items-center justify-center gap-1">
                                {leaderboard[0].totalCurrentStreak}
                                <Flame className="w-6 h-6 text-orange-400" />
                            </p>
                            <p className="text-sm text-muted">Total Streak</p>
                        </Card>
                    </div>

                    {/* Third Place */}
                    <div className="mt-8">
                        <Card className={`text-center py-6 ${getRankBg(3)}`}>
                            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
                                <span className="text-2xl font-bold text-white">
                                    {leaderboard[2].username.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <Medal className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                            <h3 className="font-semibold text-white truncate px-2">
                                {leaderboard[2].username}
                            </h3>
                            <p className="text-2xl font-bold text-white mt-2 flex items-center justify-center gap-1">
                                {leaderboard[2].totalCurrentStreak}
                                <Flame className="w-5 h-5 text-orange-400" />
                            </p>
                            <p className="text-xs text-muted">Total Streak</p>
                        </Card>
                    </div>
                </div>
            )}

            {/* Full Leaderboard */}
            <Card padding="none">
                <div className="p-4 border-b border-zinc-800">
                    <h2 className="font-semibold text-white">All Rankings</h2>
                </div>
                <div className="divide-y divide-zinc-800">
                    {leaderboard.map((user) => (
                        <div
                            key={user.id}
                            className={`flex items-center gap-4 p-4 ${user.isCurrentUser ? "bg-primary/10" : "hover:bg-surface-light"
                                } transition-colors`}
                        >
                            {/* Rank */}
                            <div className="w-10 flex justify-center">
                                {getRankIcon(user.rank)}
                            </div>

                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-semibold">
                                    {user.username.charAt(0).toUpperCase()}
                                </span>
                            </div>

                            {/* User Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-medium text-white truncate">
                                        {user.username}
                                    </h3>
                                    {user.isCurrentUser && (
                                        <span className="px-2 py-0.5 bg-primary/30 text-primary-light rounded text-xs">
                                            You
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-muted">
                                    {user.habitCount} habits • {user.totalCompletions} check-ins
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-6 text-right">
                                <div>
                                    <p className="text-lg font-bold text-white flex items-center gap-1">
                                        {user.totalCurrentStreak}
                                        <Flame className="w-4 h-4 text-orange-400" />
                                    </p>
                                    <p className="text-xs text-muted">Current</p>
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-white">
                                        {user.bestStreak}
                                    </p>
                                    <p className="text-xs text-muted">Best</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {leaderboard.length === 0 && (
                <Card className="text-center py-12">
                    <Trophy className="w-12 h-12 text-muted mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                        No rankings yet
                    </h3>
                    <p className="text-zinc-400">
                        Start building habits to appear on the leaderboard
                    </p>
                </Card>
            )}
        </div>
    );
}
