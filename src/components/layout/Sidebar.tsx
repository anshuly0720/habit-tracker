"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    LayoutDashboard,
    Target,
    Users,
    Activity,
    Trophy,
    LogOut,
    Flame,
} from "lucide-react";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/habits/new", label: "New Habit", icon: Target },
    { href: "/feed", label: "Activity Feed", icon: Activity },
    { href: "/users", label: "Find Friends", icon: Users },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

interface SidebarProps {
    username?: string;
}

export default function Sidebar({ username }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-full w-64 bg-surface border-r border-zinc-800 flex flex-col z-40">
            {/* Logo */}
            <div className="p-6 border-b border-zinc-800">
                <Link href="/dashboard" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                        <Flame className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-xl gradient-text">HabitFlow</h1>
                        <p className="text-xs text-muted">Build better habits</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${isActive
                                    ? "bg-primary/20 text-primary-light border-l-2 border-primary"
                                    : "text-zinc-400 hover:text-white hover:bg-surface-light"
                                }
              `}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User section */}
            <div className="p-4 border-t border-zinc-800">
                <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center">
                        <span className="text-white font-semibold">
                            {username?.charAt(0).toUpperCase() || "U"}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                            {username || "User"}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:text-white hover:bg-surface-light transition-colors mt-2"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
