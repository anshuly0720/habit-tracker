"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

let addToastFn: ((message: string, type: ToastType) => void) | null = null;

export function toast(message: string, type: ToastType = "info") {
    if (addToastFn) {
        addToastFn(message, type);
    }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    useEffect(() => {
        addToastFn = (message: string, type: ToastType) => {
            const id = Math.random().toString(36).substr(2, 9);
            setToasts((prev) => [...prev, { id, message, type }]);

            // Auto remove after 5 seconds
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, 5000);
        };

        return () => {
            addToastFn = null;
        };
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-success" />,
        error: <XCircle className="w-5 h-5 text-danger" />,
        info: <AlertCircle className="w-5 h-5 text-primary" />,
    };

    const styles = {
        success: "border-success/30 bg-success/10",
        error: "border-danger/30 bg-danger/10",
        info: "border-primary/30 bg-primary/10",
    };

    return (
        <>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`
              flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm
              animate-slide-up min-w-[300px] max-w-md
              ${styles[t.type]}
            `}
                    >
                        {icons[t.type]}
                        <p className="flex-1 text-sm text-white">{t.message}</p>
                        <button
                            onClick={() => removeToast(t.id)}
                            className="text-zinc-400 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </>
    );
}
