"use client";

import { useEffect, useState, useCallback } from "react";
import ActivityItem from "@/components/feed/ActivityItem";
import Card from "@/components/ui/Card";
import { Activity, Loader2, Users } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";

interface FeedItem {
    id: string;
    type: string;
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
    completedAt: string;
    relativeTime: string;
}

export default function FeedPage() {
    const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchFeed = useCallback(async () => {
        try {
            const res = await fetch("/api/feed");
            if (res.ok) {
                const data = await res.json();
                setFeedItems(data);
            }
        } catch (error) {
            console.error("Error fetching feed:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFeed();
    }, [fetchFeed]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Activity Feed</h1>
                    <p className="text-zinc-400 mt-1">
                        See what your friends have been up to
                    </p>
                </div>
                <Link href="/users">
                    <Button variant="secondary">
                        <Users className="w-4 h-4" />
                        Find Friends
                    </Button>
                </Link>
            </div>

            {/* Feed */}
            {feedItems.length === 0 ? (
                <Card className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-light flex items-center justify-center">
                        <Activity className="w-8 h-8 text-muted" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                        No activity yet
                    </h3>
                    <p className="text-zinc-400 mb-6">
                        Follow other users to see their activity here
                    </p>
                    <Link href="/users">
                        <Button variant="primary">
                            <Users className="w-4 h-4" />
                            Find Friends to Follow
                        </Button>
                    </Link>
                </Card>
            ) : (
                <div className="space-y-3">
                    {feedItems.map((item) => (
                        <ActivityItem key={item.id} activity={item} />
                    ))}
                </div>
            )}
        </div>
    );
}
