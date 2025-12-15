import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatRelativeTime, calculateStreak } from "@/lib/utils";

// GET /api/feed - Get friends' activity feed
export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get users that the current user follows
        const following = await prisma.follow.findMany({
            where: { followerId: session.user.id },
            select: { followingId: true },
        });

        const followingIds = following.map((f) => f.followingId);

        if (followingIds.length === 0) {
            return NextResponse.json([]);
        }

        // Get recent completions from followed users
        const recentCompletions = await prisma.habitCompletion.findMany({
            where: {
                userId: { in: followingIds },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
                habit: {
                    select: {
                        id: true,
                        name: true,
                        category: true,
                        frequency: true,
                    },
                    include: {
                        completions: {
                            orderBy: { completedAt: "desc" },
                        },
                    },
                },
            },
            orderBy: { completedAt: "desc" },
            take: 50,
        });

        // Format feed items
        const feedItems = recentCompletions.map((completion) => {
            const { currentStreak } = calculateStreak(
                completion.habit.completions,
                completion.habit.frequency
            );

            return {
                id: completion.id,
                type: "completion",
                user: {
                    id: completion.user.id,
                    username: completion.user.username,
                },
                habit: {
                    id: completion.habit.id,
                    name: completion.habit.name,
                    category: completion.habit.category,
                    frequency: completion.habit.frequency,
                },
                currentStreak,
                completedAt: completion.completedAt,
                relativeTime: formatRelativeTime(completion.completedAt),
            };
        });

        return NextResponse.json(feedItems);
    } catch (error) {
        console.error("Error fetching feed:", error);
        return NextResponse.json(
            { error: "Failed to fetch feed" },
            { status: 500 }
        );
    }
}
