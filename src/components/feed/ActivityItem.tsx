"use client";

import { Flame, Check } from "lucide-react";
import Card from "@/components/ui/Card";

interface ActivityItemProps {
    activity: {
        id: string;
        user: {
            id: string;
            username: string;
        };
        habit: {
            id: string;
            name: string;
            category: string;
            frequency: "DAILY" | "WEEKLY";
        };
        currentStreak: number;
        relativeTime: string;
    };
}

export default function ActivityItem({ activity }: ActivityItemProps) {
    const categoryColors: Record<string, string> = {
        Health: "bg-green-500/20 text-green-400",
        Fitness: "bg-blue-500/20 text-blue-400",
        Learning: "bg-yellow-500/20 text-yellow-400",
        Productivity: "bg-purple-500/20 text-purple-400",
        Mindfulness: "bg-pink-500/20 text-pink-400",
        General: "bg-zinc-500/20 text-zinc-400",
    };

    return (
        <Card padding="sm" className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold">
                    {activity.user.username.charAt(0).toUpperCase()}
                </span>
            </div>

            {/* Activity Info */}
            <div className="flex-1 min-w-0">
                <p className="text-sm">
                    <span className="font-semibold text-white">
                        {activity.user.username}
                    </span>{" "}
                    <span className="text-zinc-400">completed</span>{" "}
                    <span className="font-medium text-white">{activity.habit.name}</span>
                </p>
                <div className="flex items-center gap-2 mt-1">
                    <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[activity.habit.category] || categoryColors.General
                            }`}
                    >
                        {activity.habit.category}
                    </span>
                    {activity.currentStreak > 0 && (
                        <span className="flex items-center gap-1 text-xs text-orange-400">
                            <Flame className="w-3 h-3" />
                            {activity.currentStreak} streak
                        </span>
                    )}
                </div>
            </div>

            {/* Timestamp & Check */}
            <div className="flex flex-col items-end gap-1">
                <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-success" />
                </div>
                <span className="text-xs text-muted">{activity.relativeTime}</span>
            </div>
        </Card>
    );
}
