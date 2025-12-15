"use client";

import { useState } from "react";
import { UserPlus, UserMinus } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { toast } from "@/components/ui/Toast";

interface UserCardProps {
    user: {
        id: string;
        username: string;
        habitCount: number;
        followerCount: number;
        isFollowing: boolean;
    };
    onFollowChange: () => void;
}

export default function UserCard({ user, onFollowChange }: UserCardProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isFollowing, setIsFollowing] = useState(user.isFollowing);

    const handleFollowToggle = async () => {
        setIsLoading(true);
        try {
            const method = isFollowing ? "DELETE" : "POST";
            const res = await fetch(`/api/users/${user.id}/follow`, { method });
            const data = await res.json();

            if (!res.ok) {
                toast(data.error || "Failed to update follow status", "error");
                return;
            }

            setIsFollowing(!isFollowing);
            toast(isFollowing ? `Unfollowed ${user.username}` : `Following ${user.username}`, "success");
            onFollowChange();
        } catch {
            toast("An error occurred", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card hover className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">
                    {user.username.charAt(0).toUpperCase()}
                </span>
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{user.username}</h3>
                <div className="flex items-center gap-3 text-sm text-muted">
                    <span>{user.habitCount} habits</span>
                    <span>•</span>
                    <span>{user.followerCount} followers</span>
                </div>
            </div>

            {/* Follow Button */}
            <Button
                variant={isFollowing ? "secondary" : "primary"}
                size="sm"
                onClick={handleFollowToggle}
                isLoading={isLoading}
            >
                {isFollowing ? (
                    <>
                        <UserMinus className="w-4 h-4" />
                        Unfollow
                    </>
                ) : (
                    <>
                        <UserPlus className="w-4 h-4" />
                        Follow
                    </>
                )}
            </Button>
        </Card>
    );
}
