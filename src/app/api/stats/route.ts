import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateStreak, calculateCompletionRate } from "@/lib/utils";

// GET /api/stats - Get current user's stats
export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get user with habits and completions
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
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
                        following: true,
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Calculate aggregated stats
        let totalCurrentStreak = 0;
        let bestStreak = 0;
        let totalCompletions = 0;
        let activeHabits = 0;

        const habitStats = user.habits.map((habit) => {
            const { currentStreak, longestStreak } = calculateStreak(
                habit.completions,
                habit.frequency
            );
            const completionRate = calculateCompletionRate(
                habit.completions,
                habit.createdAt,
                habit.frequency
            );

            totalCurrentStreak += currentStreak;
            bestStreak = Math.max(bestStreak, longestStreak);
            totalCompletions += habit.completions.length;
            if (currentStreak > 0) activeHabits++;

            return {
                id: habit.id,
                name: habit.name,
                currentStreak,
                longestStreak,
                completionRate,
            };
        });

        // Calculate overall completion rate
        const overallCompletionRate =
            habitStats.length > 0
                ? Math.round(
                    habitStats.reduce((acc, h) => acc + h.completionRate, 0) /
                    habitStats.length
                )
                : 0;

        return NextResponse.json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
            },
            stats: {
                totalHabits: user.habits.length,
                activeHabits,
                totalCurrentStreak,
                bestStreak,
                totalCompletions,
                overallCompletionRate,
                followerCount: user._count.followers,
                followingCount: user._count.following,
            },
            habits: habitStats,
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch stats" },
            { status: 500 }
        );
    }
}
