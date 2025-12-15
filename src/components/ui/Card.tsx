"use client";

import { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    padding?: "none" | "sm" | "md" | "lg";
}

export default function Card({
    children,
    className = "",
    hover = false,
    padding = "md",
}: CardProps) {
    const paddingStyles = {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
    };

    return (
        <div
            className={`
        bg-surface rounded-xl border border-zinc-800
        ${paddingStyles[padding]}
        ${hover ? "hover:border-zinc-700 hover:shadow-xl transition-all duration-300" : ""}
        ${className}
      `}
        >
            {children}
        </div>
    );
}
