import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/users/[id]/follow - Follow user
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        const { id } = await params;

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Prevent self-follow
        if (id === session.user.id) {
            return NextResponse.json(
                { error: "You cannot follow yourself" },
                { status: 400 }
            );
        }

        // Check if target user exists
        const targetUser = await prisma.user.findUnique({
            where: { id },
        });

        if (!targetUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if already following
        const existingFollow = await prisma.follow.findFirst({
            where: {
                followerId: session.user.id,
                followingId: id,
            },
        });

        if (existingFollow) {
            return NextResponse.json(
                { error: "You are already following this user" },
                { status: 400 }
            );
        }

        // Create follow relationship
        await prisma.follow.create({
            data: {
                followerId: session.user.id,
                followingId: id,
            },
        });

        return NextResponse.json({ message: "Successfully followed user" });
    } catch (error) {
        console.error("Error following user:", error);
        return NextResponse.json(
            { error: "Failed to follow user" },
            { status: 500 }
        );
    }
}

// DELETE /api/users/[id]/follow - Unfollow user
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        const { id } = await params;

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Find and delete follow relationship
        const follow = await prisma.follow.findFirst({
            where: {
                followerId: session.user.id,
                followingId: id,
            },
        });

        if (!follow) {
            return NextResponse.json(
                { error: "You are not following this user" },
                { status: 400 }
            );
        }

        await prisma.follow.delete({
            where: { id: follow.id },
        });

        return NextResponse.json({ message: "Successfully unfollowed user" });
    } catch (error) {
        console.error("Error unfollowing user:", error);
        return NextResponse.json(
            { error: "Failed to unfollow user" },
            { status: 500 }
        );
    }
}
