"use client";

import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className = "", label, error, options, id, ...props }, ref) => {
        const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={selectId}
                        className="block text-sm font-medium text-zinc-300 mb-1.5"
                    >
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    id={selectId}
                    className={`
            w-full px-4 py-3 bg-surface border rounded-lg text-white 
            transition-colors duration-200 cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background
            ${error
                            ? "border-danger focus:border-danger focus:ring-danger"
                            : "border-zinc-700 focus:border-primary focus:ring-primary"
                        }
            ${className}
          `}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && (
                    <p className="mt-1.5 text-sm text-danger">{error}</p>
                )}
            </div>
        );
    }
);

Select.displayName = "Select";

export default Select;
