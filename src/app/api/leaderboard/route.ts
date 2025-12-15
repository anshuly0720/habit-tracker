import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateStreak } from "@/lib/utils";

// GET /api/leaderboard - Get leaderboard ranked by streaks
export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get all users with their habits and completions
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                habits: {
                    include: {
                        completions: {
                            orderBy: { completedAt: "desc" },
                        },
                    },
                },
                _count: {
                    select: {
                        followers: true,
                    },
                },
            },
        });

        // Calculate total and best streaks for each user
        const leaderboardData = users.map((user) => {
            let totalCurrentStreak = 0;
            let bestStreak = 0;
            let totalCompletions = 0;

            user.habits.forEach((habit) => {
                const { currentStreak, longestStreak } = calculateStreak(
                    habit.completions,
                    habit.frequency
                );
                totalCurrentStreak += currentStreak;
                bestStreak = Math.max(bestStreak, longestStreak);
                totalCompletions += habit.completions.length;
            });

            return {
                id: user.id,
                username: user.username,
                totalCurrentStreak,
                bestStreak,
                habitCount: user.habits.length,
                totalCompletions,
                followerCount: user._count.followers,
                isCurrentUser: user.id === session.user.id,
            };
        });

        // Sort by total current streak (descending)
        leaderboardData.sort((a, b) => b.totalCurrentStreak - a.totalCurrentStreak);

        // Add ranks
        const rankedLeaderboard = leaderboardData.map((user, index) => ({
            ...user,
            rank: index + 1,
        }));

        return NextResponse.json(rankedLeaderboard);
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return NextResponse.json(
            { error: "Failed to fetch leaderboard" },
            { status: 500 }
        );
    }
}
