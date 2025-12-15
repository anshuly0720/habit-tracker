"use client";

import { useState } from "react";
import { Check, MoreVertical, Trash2, Edit, Flame, Undo2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import { toast } from "@/components/ui/Toast";
import Link from "next/link";

interface HabitCardProps {
    habit: {
        id: string;
        name: string;
        category: string;
        frequency: "DAILY" | "WEEKLY";
        currentStreak: number;
        longestStreak: number;
        completionRate: number;
        isCompletedToday: boolean;
        totalCompletions: number;
    };
    onComplete: (id: string) => Promise<void>;
    onUncomplete: (id: string) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

export default function HabitCard({
    habit,
    onComplete,
    onUncomplete,
    onDelete,
}: HabitCardProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleComplete = async () => {
        setIsLoading(true);
        try {
            if (habit.isCompletedToday) {
                await onUncomplete(habit.id);
            } else {
                await onComplete(habit.id);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            await onDelete(habit.id);
            toast("Habit deleted successfully", "success");
        } catch {
            toast("Failed to delete habit", "error");
        } finally {
            setIsLoading(false);
            setShowDeleteModal(false);
        }
    };

    const categoryColors: Record<string, string> = {
        Health: "bg-green-500/20 text-green-400",
        Fitness: "bg-blue-500/20 text-blue-400",
        Learning: "bg-yellow-500/20 text-yellow-400",
        Productivity: "bg-purple-500/20 text-purple-400",
        Mindfulness: "bg-pink-500/20 text-pink-400",
        General: "bg-zinc-500/20 text-zinc-400",
    };

    return (
        <>
            <Card hover className="group relative">
                {/* Menu Button */}
                <div className="absolute top-4 right-4">
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-surface-light transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <MoreVertical className="w-5 h-5" />
                        </button>

                        {showMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowMenu(false)}
                                />
                                <div className="absolute right-0 top-10 z-20 bg-surface-light border border-zinc-700 rounded-lg shadow-xl py-1 min-w-[140px]">
                                    <Link
                                        href={`/habits/${habit.id}/edit`}
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:bg-surface hover:text-white transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setShowMenu(false);
                                            setShowDeleteModal(true);
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-surface transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    {/* Check-in Button */}
                    <button
                        onClick={handleComplete}
                        disabled={isLoading}
                        className={`
              w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300
              ${habit.isCompletedToday
                                ? "bg-success text-white shadow-lg shadow-success/30"
                                : "bg-surface-light text-zinc-400 hover:text-white hover:bg-primary hover:shadow-lg hover:shadow-primary/30"
                            }
              disabled:opacity-50
            `}
                    >
                        {habit.isCompletedToday ? (
                            <Check className="w-7 h-7" />
                        ) : (
                            <div className="w-7 h-7 border-2 border-current rounded-full" />
                        )}
                    </button>

                    {/* Habit Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg text-white truncate">
                                {habit.name}
                            </h3>
                            {habit.currentStreak >= 3 && (
                                <span className="flex items-center gap-1 text-orange-400">
                                    <Flame className="w-4 h-4" />
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-2 flex-wrap mb-3">
                            <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[habit.category] || categoryColors.General
                                    }`}
                            >
                                {habit.category}
                            </span>
                            <span className="text-xs text-muted">
                                {habit.frequency === "DAILY" ? "Daily" : "Weekly"}
                            </span>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <p className="text-2xl font-bold text-white flex items-center gap-1">
                                    {habit.currentStreak}
                                    {habit.currentStreak > 0 && (
                                        <Flame className="w-5 h-5 text-orange-400" />
                                    )}
                                </p>
                                <p className="text-xs text-muted">Current Streak</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">
                                    {habit.longestStreak}
                                </p>
                                <p className="text-xs text-muted">Best Streak</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">
                                    {habit.completionRate}%
                                </p>
                                <p className="text-xs text-muted">Completion</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4 h-2 bg-surface-light rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-primary to-purple-400 transition-all duration-500"
                                style={{ width: `${habit.completionRate}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Undo button for completed habits */}
                {habit.isCompletedToday && (
                    <button
                        onClick={handleComplete}
                        disabled={isLoading}
                        className="absolute bottom-4 right-4 flex items-center gap-1 text-xs text-zinc-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <Undo2 className="w-3 h-3" />
                        Undo
                    </button>
                )}
            </Card>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Habit"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDelete}
                            isLoading={isLoading}
                        >
                            Delete
                        </Button>
                    </>
                }
            >
                <p className="text-zinc-300">
                    Are you sure you want to delete <strong>{habit.name}</strong>? This
                    will also delete all completion history. This action cannot be undone.
                </p>
            </Modal>
        </>
    );
}
