import HabitForm from "@/components/habits/HabitForm";

export default function NewHabitPage() {
    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create New Habit</h1>
            <p className="text-zinc-400 mb-8">
                Set up a new habit to track and build your streak
            </p>
            <HabitForm />
        </div>
    );
}
