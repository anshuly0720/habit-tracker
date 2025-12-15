"use client";

import { useState, useCallback } from "react";
import UserCard from "@/components/users/UserCard";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { Search, Users, Loader2 } from "lucide-react";

interface User {
    id: string;
    username: string;
    habitCount: number;
    followerCount: number;
    followingCount: number;
    isFollowing: boolean;
}

export default function UsersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const searchUsers = useCallback(async (query: string) => {
        if (query.length < 2) {
            setUsers([]);
            setHasSearched(false);
            return;
        }

        setIsSearching(true);
        setHasSearched(true);

        try {
            const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Error searching users:", error);
        } finally {
            setIsSearching(false);
        }
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Debounce search
        const timeoutId = setTimeout(() => {
            searchUsers(query);
        }, 300);

        return () => clearTimeout(timeoutId);
    };

    const handleFollowChange = () => {
        // Refresh search results
        if (searchQuery.length >= 2) {
            searchUsers(searchQuery);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Find Friends</h1>
                <p className="text-zinc-400 mt-1">
                    Search for users to follow and see their progress
                </p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <Input
                    placeholder="Search by username or email..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="pl-12"
                />
            </div>

            {/* Search Results */}
            {isSearching ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : users.length > 0 ? (
                <div className="space-y-3">
                    {users.map((user) => (
                        <UserCard
                            key={user.id}
                            user={user}
                            onFollowChange={handleFollowChange}
                        />
                    ))}
                </div>
            ) : hasSearched ? (
                <Card className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-light flex items-center justify-center">
                        <Users className="w-8 h-8 text-muted" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                        No users found
                    </h3>
                    <p className="text-zinc-400">
                        Try a different search term
                    </p>
                </Card>
            ) : (
                <Card className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-light flex items-center justify-center">
                        <Search className="w-8 h-8 text-muted" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                        Search for friends
                    </h3>
                    <p className="text-zinc-400">
                        Enter at least 2 characters to search
                    </p>
                </Card>
            )}
        </div>
    );
}
