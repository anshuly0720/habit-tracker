import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/users/search?q=query - Search users
export async function GET(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q");

        if (!query || query.length < 2) {
            return NextResponse.json(
                { error: "Search query must be at least 2 characters" },
                { status: 400 }
            );
        }

        const users = await prisma.user.findMany({
            where: {
                AND: [
                    { id: { not: session.user.id } }, // Exclude current user
                    {
                        OR: [
                            { username: { contains: query, mode: "insensitive" } },
                            { email: { contains: query, mode: "insensitive" } },
                        ],
                    },
                ],
            },
            select: {
                id: true,
                username: true,
                createdAt: true,
                _count: {
                    select: {
                        habits: true,
                        followers: true,
                        following: true,
                    },
                },
            },
            take: 20,
        });

        // Check follow status for each user
        const followStatuses = await prisma.follow.findMany({
            where: {
                followerId: session.user.id,
                followingId: { in: users.map((u) => u.id) },
            },
        });

        const followingIds = new Set(followStatuses.map((f) => f.followingId));

        const usersWithFollowStatus = users.map((user) => ({
            id: user.id,
            username: user.username,
            createdAt: user.createdAt,
            habitCount: user._count.habits,
            followerCount: user._count.followers,
            followingCount: user._count.following,
            isFollowing: followingIds.has(user.id),
        }));

        return NextResponse.json(usersWithFollowStatus);
    } catch (error) {
        console.error("Error searching users:", error);
        return NextResponse.json(
            { error: "Failed to search users" },
            { status: 500 }
        );
    }
}
