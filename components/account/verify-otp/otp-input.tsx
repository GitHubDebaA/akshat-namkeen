"use client";

import { useEffect, useRef } from "react";

interface OtpInputProps {
    value: string;
    onChange: (value: string) => void;
    length?: number;
    disabled?: boolean;
}

export default function OtpInput({
    value,
    onChange,
    length = 6,
    disabled,
}: OtpInputProps) {
    const refs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        refs.current[0]?.focus();
    }, []);

    const handleChange = (index: number, input: string) => {
        if (!/^\d*$/.test(input)) return;

        const chars = value.split("");

        chars[index] = input.slice(-1);

        const otp = chars.join("");

        onChange(otp);

        if (input && index < length - 1) {
            refs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Backspace") {
            if (value[index]) {
                const chars = value.split("");
                chars[index] = "";
                onChange(chars.join(""));
            } else if (index > 0) {
                refs.current[index - 1]?.focus();
            }
        }
    };

    const handlePaste = (
        e: React.ClipboardEvent<HTMLInputElement>
    ) => {
        e.preventDefault();

        const pasted = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, length);

        onChange(pasted);

        refs.current[Math.min(pasted.length, length - 1)]?.focus();
    };

    return (
        <div className="flex justify-center gap-3">
            {Array.from({ length }).map((_, index) => (
                <input
                    key={index}
                    ref={(el) => {
                        refs.current[index] = el;
                    }}
                    value={value[index] || ""}
                    disabled={disabled}
                    maxLength={1}
                    inputMode="numeric"
                    onPaste={handlePaste}
                    onChange={(e) =>
                        handleChange(index, e.target.value)
                    }
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="
                    h-14
                    w-14
                    rounded-xl
                    border
                    border-obsidian/15
                    text-center
                    text-xl
                    font-semibold
                    outline-none
                    transition
                    focus:border-project_primary
                    focus:ring-2
                    focus:ring-project_primary/20
                "
                />
            ))}
        </div>
    );
}