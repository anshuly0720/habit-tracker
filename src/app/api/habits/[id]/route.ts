import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateHabitSchema = z.object({
    name: z
        .string()
        .min(1, "Habit name is required")
        .max(50, "Habit name must be at most 50 characters")
        .optional(),
    category: z.string().optional(),
    frequency: z.enum(["DAILY", "WEEKLY"]).optional(),
});

// GET /api/habits/[id] - Get single habit
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        const { id } = await params;

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const habit = await prisma.habit.findFirst({
            where: {
                id,
                userId: session.user.id,
            },
            include: {
                completions: {
                    orderBy: { completedAt: "desc" },
                    take: 30,
                },
            },
        });

        if (!habit) {
            return NextResponse.json({ error: "Habit not found" }, { status: 404 });
        }

        return NextResponse.json(habit);
    } catch (error) {
        console.error("Error fetching habit:", error);
        return NextResponse.json(
            { error: "Failed to fetch habit" },
            { status: 500 }
        );
    }
}

// PUT /api/habits/[id] - Update habit
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        const { id } = await params;

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        // Validate input
        const validationResult = updateHabitSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: validationResult.error.errors[0].message },
                { status: 400 }
            );
        }

        // Check if habit exists and belongs to user
        const existingHabit = await prisma.habit.findFirst({
            where: {
                id,
                userId: session.user.id,
            },
        });

        if (!existingHabit) {
            return NextResponse.json({ error: "Habit not found" }, { status: 404 });
        }

        const { name, category, frequency } = validationResult.data;

        // Check for duplicate name if name is being changed
        if (name && name !== existingHabit.name) {
            const duplicateHabit = await prisma.habit.findFirst({
                where: {
                    userId: session.user.id,
                    name: {
                        equals: name,
                        mode: "insensitive",
                    },
                    id: { not: id },
                },
            });

            if (duplicateHabit) {
                return NextResponse.json(
                    { error: "You already have a habit with this name" },
                    { status: 400 }
                );
            }
        }

        // Update habit
        const updatedHabit = await prisma.habit.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(category && { category }),
                ...(frequency && { frequency }),
            },
        });

        return NextResponse.json(updatedHabit);
    } catch (error) {
        console.error("Error updating habit:", error);
        return NextResponse.json(
            { error: "Failed to update habit" },
            { status: 500 }
        );
    }
}

// DELETE /api/habits/[id] - Delete habit
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

        // Check if habit exists and belongs to user
        const habit = await prisma.habit.findFirst({
            where: {
                id,
                userId: session.user.id,
            },
        });

        if (!habit) {
            return NextResponse.json({ error: "Habit not found" }, { status: 404 });
        }

        // Delete habit (completions will cascade delete)
        await prisma.habit.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Habit deleted successfully" });
    } catch (error) {
        console.error("Error deleting habit:", error);
        return NextResponse.json(
            { error: "Failed to delete habit" },
            { status: 500 }
        );
    }
}
