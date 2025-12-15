import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0a0a0b",
                surface: "#18181b",
                "surface-light": "#27272a",
                primary: {
                    DEFAULT: "#8b5cf6",
                    hover: "#7c3aed",
                    light: "#a78bfa",
                },
                success: {
                    DEFAULT: "#22c55e",
                    light: "#4ade80",
                },
                warning: {
                    DEFAULT: "#f59e0b",
                    light: "#fbbf24",
                },
                danger: {
                    DEFAULT: "#ef4444",
                    light: "#f87171",
                },
                muted: "#71717a",
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
            },
            animation: {
                "fade-in": "fadeIn 0.3s ease-out",
                "slide-up": "slideUp 0.3s ease-out",
                "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
        },
    },
    plugins: [],
};

export default config;
