import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStartOfPeriod, getEndOfPeriod } from "@/lib/utils";

// POST /api/habits/[id]/complete - Mark habit as complete
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

        // Get habit
        const habit = await prisma.habit.findFirst({
            where: {
                id,
                userId: session.user.id,
            },
        });

        if (!habit) {
            return NextResponse.json({ error: "Habit not found" }, { status: 404 });
        }

        const now = new Date();
        const periodStart = getStartOfPeriod(now, habit.frequency);
        const periodEnd = getEndOfPeriod(now, habit.frequency);

        // Check if already completed in current period
        const existingCompletion = await prisma.habitCompletion.findFirst({
            where: {
                habitId: id,
                userId: session.user.id,
                completedAt: {
                    gte: periodStart,
                    lte: periodEnd,
                },
            },
        });

        if (existingCompletion) {
            const periodType = habit.frequency === "DAILY" ? "today" : "this week";
            return NextResponse.json(
                { error: `You've already completed this habit ${periodType}` },
                { status: 400 }
            );
        }

        // Create completion
        const completion = await prisma.habitCompletion.create({
            data: {
                habitId: id,
                userId: session.user.id,
            },
        });

        return NextResponse.json({
            message: "Habit marked as complete!",
            completion,
        });
    } catch (error) {
        console.error("Error completing habit:", error);
        return NextResponse.json(
            { error: "Failed to complete habit" },
            { status: 500 }
        );
    }
}

// DELETE /api/habits/[id]/complete - Undo completion (for current period only)
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

        // Get habit
        const habit = await prisma.habit.findFirst({
            where: {
                id,
                userId: session.user.id,
            },
        });

        if (!habit) {
            return NextResponse.json({ error: "Habit not found" }, { status: 404 });
        }

        const now = new Date();
        const periodStart = getStartOfPeriod(now, habit.frequency);
        const periodEnd = getEndOfPeriod(now, habit.frequency);

        // Find and delete current period completion
        const completion = await prisma.habitCompletion.findFirst({
            where: {
                habitId: id,
                userId: session.user.id,
                completedAt: {
                    gte: periodStart,
                    lte: periodEnd,
                },
            },
        });

        if (!completion) {
            return NextResponse.json(
                { error: "No completion found for current period" },
                { status: 404 }
            );
        }

        await prisma.habitCompletion.delete({
            where: { id: completion.id },
        });

        return NextResponse.json({ message: "Completion undone" });
    } catch (error) {
        console.error("Error undoing completion:", error);
        return NextResponse.json(
            { error: "Failed to undo completion" },
            { status: 500 }
        );
    }
}
