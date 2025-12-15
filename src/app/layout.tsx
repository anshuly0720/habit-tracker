import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "HabitFlow - Track Your Habits, Transform Your Life",
    description: "A modern habit tracking app with social accountability. Build better habits, track your progress, and stay motivated with friends.",
    keywords: ["habit tracker", "productivity", "goals", "habits", "self-improvement"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-background text-white antialiased">
                {children}
            </body>
        </html>
    );
}
//just for checking