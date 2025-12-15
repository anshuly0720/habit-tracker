import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import {
    getStartOfPeriod,
    getEndOfPeriod,
    calculateStreak,
    calculateCompletionRate,
} from "@/lib/utils";

const createHabitSchema = z.object({
    name: z
        .string()
        .min(1, "Habit name is required")
        .max(50, "Habit name must be at most 50 characters"),
    category: z.string().optional().default("General"),
    frequency: z.enum(["DAILY", "WEEKLY"]).default("DAILY"),
});

// GET /api/habits - List user's habits
export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const habits = await prisma.habit.findMany({
            where: { userId: session.user.id },
            include: {
                completions: {
                    orderBy: { completedAt: "desc" },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        // Calculate streaks and completion rates
        const habitsWithStats = habits.map((habit) => {
            const { currentStreak, longestStreak } = calculateStreak(
                habit.completions,
                habit.frequency
            );
            const completionRate = calculateCompletionRate(
                habit.completions,
                habit.createdAt,
                habit.frequency
            );

            // Check if completed in current period
            const now = new Date();
            const periodStart = getStartOfPeriod(now, habit.frequency);
            const periodEnd = getEndOfPeriod(now, habit.frequency);
            const isCompletedToday = habit.completions.some((c) => {
                const completedAt = new Date(c.completedAt);
                return completedAt >= periodStart && completedAt <= periodEnd;
            });

            return {
                id: habit.id,
                name: habit.name,
                category: habit.category,
                frequency: habit.frequency,
                currentStreak,
                longestStreak,
                completionRate,
                isCompletedToday,
                createdAt: habit.createdAt,
                totalCompletions: habit.completions.length,
            };
        });

        return NextResponse.json(habitsWithStats);
    } catch (error) {
        console.error("Error fetching habits:", error);
        return NextResponse.json(
            { error: "Failed to fetch habits" },
            { status: 500 }
        );
    }
}

// POST /api/habits - Create new habit
export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        // Validate input
        const validationResult = createHabitSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: validationResult.error.errors[0].message },
                { status: 400 }
            );
        }

        const { name, category, frequency } = validationResult.data;

        // Check for duplicate habit name for this user
        const existingHabit = await prisma.habit.findFirst({
            where: {
                userId: session.user.id,
                name: {
                    equals: name,
                    mode: "insensitive",
                },
            },
        });

        if (existingHabit) {
            return NextResponse.json(
                { error: "You already have a habit with this name" },
                { status: 400 }
            );
        }

        // Create habit
        const habit = await prisma.habit.create({
            data: {
                name,
                category,
                frequency,
                userId: session.user.id,
            },
        });

        return NextResponse.json(habit, { status: 201 });
    } catch (error) {
        console.error("Error creating habit:", error);
        return NextResponse.json(
            { error: "Failed to create habit" },
            { status: 500 }
        );
    }
}
