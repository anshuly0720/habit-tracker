import {
    startOfDay,
    endOfDay,
    startOfWeek,
    endOfWeek,
    isAfter,
    isBefore,
    differenceInDays,
    differenceInWeeks,
} from "date-fns";
import { Frequency } from "@prisma/client";

/**
 * Get the start of the current period based on frequency
 */
export function getStartOfPeriod(date: Date, frequency: Frequency): Date {
    if (frequency === "DAILY") {
        return startOfDay(date);
    }
    return startOfWeek(date, { weekStartsOn: 1 }); // Monday
}

/**
 * Get the end of the current period based on frequency
 */
export function getEndOfPeriod(date: Date, frequency: Frequency): Date {
    if (frequency === "DAILY") {
        return endOfDay(date);
    }
    return endOfWeek(date, { weekStartsOn: 1 }); // Sunday
}

/**
 * Check if a date is within the current period
 */
export function isInCurrentPeriod(date: Date, frequency: Frequency): boolean {
    const now = new Date();
    const periodStart = getStartOfPeriod(now, frequency);
    const periodEnd = getEndOfPeriod(now, frequency);

    return !isBefore(date, periodStart) && !isAfter(date, periodEnd);
}

/**
 * Calculate streak based on completions
 */
export function calculateStreak(
    completions: { completedAt: Date }[],
    frequency: Frequency
): { currentStreak: number; longestStreak: number } {
    if (completions.length === 0) {
        return { currentStreak: 0, longestStreak: 0 };
    }

    // Sort completions by date descending
    const sortedCompletions = [...completions].sort(
        (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;
    const now = new Date();

    // Check if the most recent completion is in the current or previous period
    const mostRecentCompletion = new Date(sortedCompletions[0].completedAt);
    const currentPeriodStart = getStartOfPeriod(now, frequency);
    const previousPeriodStart = getStartOfPeriod(
        new Date(currentPeriodStart.getTime() - 1),
        frequency
    );

    const isRecentEnough =
        !isBefore(mostRecentCompletion, previousPeriodStart);

    if (!isRecentEnough) {
        // Streak is broken
        currentStreak = 0;
    } else {
        currentStreak = 1;
    }

    // Calculate streaks by comparing consecutive completions
    for (let i = 0; i < sortedCompletions.length - 1; i++) {
        const current = new Date(sortedCompletions[i].completedAt);
        const next = new Date(sortedCompletions[i + 1].completedAt);

        const diff =
            frequency === "DAILY"
                ? differenceInDays(getStartOfPeriod(current, frequency), getStartOfPeriod(next, frequency))
                : differenceInWeeks(getStartOfPeriod(current, frequency), getStartOfPeriod(next, frequency));

        if (diff === 1) {
            tempStreak++;
            if (i < sortedCompletions.length - 1 && isRecentEnough && i === 0) {
                currentStreak = tempStreak;
            }
        } else if (diff === 0) {
            // Same period, continue
            continue;
        } else {
            // Gap in streak
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
            if (isRecentEnough && i === 0) {
                currentStreak = 1;
            }
        }
    }

    longestStreak = Math.max(longestStreak, tempStreak);
    if (isRecentEnough) {
        currentStreak = Math.max(currentStreak, tempStreak);
    }

    return { currentStreak, longestStreak };
}

/**
 * Calculate completion rate for a habit
 */
export function calculateCompletionRate(
    completions: { completedAt: Date }[],
    createdAt: Date,
    frequency: Frequency
): number {
    const now = new Date();
    const daysSinceCreation = Math.max(1, differenceInDays(now, createdAt) + 1);

    if (frequency === "DAILY") {
        const totalDays = daysSinceCreation;
        const completedDays = new Set(
            completions.map((c) =>
                startOfDay(new Date(c.completedAt)).toISOString()
            )
        ).size;
        return Math.round((completedDays / totalDays) * 100);
    } else {
        const totalWeeks = Math.max(1, differenceInWeeks(now, createdAt) + 1);
        const completedWeeks = new Set(
            completions.map((c) =>
                startOfWeek(new Date(c.completedAt), { weekStartsOn: 1 }).toISOString()
            )
        ).size;
        return Math.round((completedWeeks / totalWeeks) * 100);
    }
}

/**
 * Format relative time
 */
export function formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(date).toLocaleDateString();
}
