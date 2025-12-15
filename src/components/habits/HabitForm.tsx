"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Card from "@/components/ui/Card";
import { toast } from "@/components/ui/Toast";

interface HabitFormProps {
    habit?: {
        id: string;
        name: string;
        category: string;
        frequency: "DAILY" | "WEEKLY";
    };
    isEditing?: boolean;
}

const categories = [
    { value: "General", label: "General" },
    { value: "Health", label: "Health" },
    { value: "Fitness", label: "Fitness" },
    { value: "Learning", label: "Learning" },
    { value: "Productivity", label: "Productivity" },
    { value: "Mindfulness", label: "Mindfulness" },
];

const frequencies = [
    { value: "DAILY", label: "Daily" },
    { value: "WEEKLY", label: "Weekly" },
];

export default function HabitForm({ habit, isEditing = false }: HabitFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: habit?.name || "",
        category: habit?.category || "General",
        frequency: habit?.frequency || "DAILY",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const url = isEditing ? `/api/habits/${habit?.id}` : "/api/habits";
            const method = isEditing ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Something went wrong");
                return;
            }

            toast(
                isEditing ? "Habit updated successfully!" : "Habit created successfully!",
                "success"
            );
            router.push("/dashboard");
            router.refresh();
        } catch {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">
                {isEditing ? "Edit Habit" : "Create New Habit"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Habit Name"
                    placeholder="e.g., Morning meditation"
                    value={formData.name}
                    onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                    }
                    error={error && error.includes("name") ? error : undefined}
                    required
                    maxLength={50}
                />

                <Select
                    label="Category"
                    options={categories}
                    value={formData.category}
                    onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                    }
                />

                <Select
                    label="Frequency"
                    options={frequencies}
                    value={formData.frequency}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            frequency: e.target.value as "DAILY" | "WEEKLY",
                        })
                    }
                />

                {error && !error.includes("name") && (
                    <p className="text-danger text-sm bg-danger/10 border border-danger/30 rounded-lg px-4 py-3">
                        {error}
                    </p>
                )}

                <div className="flex gap-3 pt-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => router.back()}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={isLoading}
                        className="flex-1"
                    >
                        {isEditing ? "Save Changes" : "Create Habit"}
                    </Button>
                </div>
            </form>
        </Card>
    );
}
