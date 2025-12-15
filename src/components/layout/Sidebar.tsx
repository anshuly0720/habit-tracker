"use client";

import { useState } from "react";
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
    Menu,
    X,
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
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);
    const closeSidebar = () => setIsOpen(false);

    return (
        <>
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-surface border-b border-zinc-800 flex items-center justify-between px-4 z-50">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                        <Flame className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg gradient-text">HabitFlow</span>
                </Link>
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-surface-light transition-colors"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </header>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 z-40"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 h-full w-64 bg-surface border-r border-zinc-800 flex flex-col z-50
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
            >
                {/* Logo - Hidden on mobile (shown in header instead) */}
                <div className="hidden lg:block p-6 border-b border-zinc-800">
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

                {/* Mobile spacer for header */}
                <div className="lg:hidden h-16" />

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={closeSidebar}
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
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center flex-shrink-0">
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
        </>
    );
}
