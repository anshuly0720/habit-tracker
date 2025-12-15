import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import HabitForm from "@/components/habits/HabitForm";

interface EditHabitPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditHabitPage({ params }: EditHabitPageProps) {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
        redirect("/login");
    }

    const habit = await prisma.habit.findFirst({
        where: {
            id,
            userId: session.user.id,
        },
    });

    if (!habit) {
        notFound();
    }

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-3xl font-bold text-white mb-2">Edit Habit</h1>
            <p className="text-zinc-400 mb-8">Update your habit settings</p>
            <HabitForm
                habit={{
                    id: habit.id,
                    name: habit.name,
                    category: habit.category,
                    frequency: habit.frequency,
                }}
                isEditing
            />
        </div>
    );
}
