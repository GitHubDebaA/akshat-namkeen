"use client";

import { useState } from "react";
import { Check, ChevronLeft, Circle, Eye, EyeOff, KeyRound, Lock, ShieldCheck, X } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { resetPasswordSchema, ResetPasswordInput } from "@/lib/auth-schema";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface Props {
    email: string;
    onClose: () => void;
    onBack: () => void;
    onCompleted: () => void;
}

export default function UpdatePassword({ email, onClose, onBack, onCompleted }: Props) {
    const [showConfirm, setShowConfirm] = useState(false);
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
        mode: "onChange",
    });

    const password = useWatch({ control, name: "password", defaultValue: "" });
    const confirmation = useWatch({ control, name: "confirmPassword", defaultValue: "" });
    const requirements = [
        { label: "At least 8 characters", met: password.length >= 8 },
        { label: "One uppercase letter", met: /[A-Z]/.test(password) },
        { label: "One lowercase letter", met: /[a-z]/.test(password) },
        { label: "One number", met: /[0-9]/.test(password) },
        { label: "One special character", met: /[^A-Za-z0-9]/.test(password) },
    ];
    const passwordsMatch = confirmation.length > 0 && password === confirmation;

    async function onSubmit(data: ResetPasswordInput) {
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password: data.password }),
            });
            const result = await res.json();

            if (!res.ok) {
                toast.error(result.error ?? "Unable to update your password.");
                return;
            }

            toast.success("Password updated successfully.");
            onCompleted();
        } catch {
            toast.error("Unable to update your password. Please try again.");
        }
    }

    return (
        <>
            <div className="border-b border-brand-200 bg-white/80 px-6 py-5">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <button type="button" onClick={onBack} aria-label="Go back" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-obsidian/70 hover:bg-brand-50 hover:text-project_primary">
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-project_primary">Password reset · Final step</p>
                            <h2 className="truncate font-display text-lg font-medium text-obsidian">Create a new password</h2>
                        </div>
                    </div>
                    <button type="button" onClick={onClose} aria-label="Close" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-obsidian/60 hover:bg-brand-50 hover:text-obsidian">
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-brand-50/60 to-ivory px-6 py-7">
                <div className="mb-7 flex items-start gap-3 rounded-2xl border border-brand-200/70 bg-white/85 p-4 shadow-sm">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-project_primary/10 text-project_primary">
                        <ShieldCheck className="h-5 w-5" />
                    </span>
                    <div>
                        <p className="font-medium text-obsidian">Your email is verified</p>
                        <p className="mt-1 text-sm leading-relaxed text-obsidian/60">Choose a strong password you haven’t used before.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label htmlFor="new-password" className="mb-2 block text-sm font-medium text-obsidian">New password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-obsidian/45" />
                            <input
                                id="new-password"
                                type="password"
                                autoComplete="new-password"
                                placeholder="Enter a new password"
                                {...register("password")}
                                aria-invalid={!!errors.password}
                                className={`h-12 w-full rounded-xl border bg-white pl-11 pr-4 shadow-sm outline-none transition focus:ring-2 ${errors.password ? "border-project_primary focus:ring-project_primary/15" : "border-brand-200 focus:border-project_primary focus:ring-project_primary/15"}`}
                            />
                        </div>
                        <p className="mt-1.5 text-xs text-obsidian/50">Your password stays hidden as you type.</p>
                    </div>

                    <div>
                        <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium text-obsidian">Confirm new password</label>
                        <div className="relative">
                            <KeyRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-obsidian/45" />
                            <input
                                id="confirm-password"
                                type={showConfirm ? "text" : "password"}
                                autoComplete="new-password"
                                placeholder="Re-enter your new password"
                                {...register("confirmPassword")}
                                aria-invalid={!!errors.confirmPassword}
                                className={`h-12 w-full rounded-xl border bg-white pl-11 pr-12 shadow-sm outline-none transition focus:ring-2 ${errors.confirmPassword ? "border-project_primary focus:ring-project_primary/15" : "border-brand-200 focus:border-project_primary focus:ring-project_primary/15"}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm((shown) => !shown)}
                                aria-label={showConfirm ? "Hide confirmation password" : "Show confirmation password"}
                                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-obsidian/50 hover:bg-brand-50 hover:text-project_primary"
                            >
                                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {confirmation && <p className={`mt-1.5 text-xs font-medium ${passwordsMatch ? "text-emerald-700" : "text-project_primary"}`}>
                            {passwordsMatch ? "Passwords match" : "Passwords do not match yet"}
                        </p>}
                        {errors.confirmPassword && !confirmation && <p className="mt-1.5 text-xs text-project_primary">{errors.confirmPassword.message}</p>}
                    </div>

                    <div className="rounded-2xl border border-brand-200/80 bg-white p-4 shadow-sm" aria-live="polite">
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-obsidian">Password requirements</p>
                            <span className="text-xs text-obsidian/50">Checks as you type</span>
                        </div>
                        <ul className="grid gap-2 sm:grid-cols-2">
                            {requirements.map(({ label, met }) => (
                                <li key={label} className={`flex items-center gap-2 text-xs transition-colors ${met ? "font-medium text-emerald-700" : "text-obsidian/55"}`}>
                                    {met ? <Check className="h-4 w-4 shrink-0" /> : <Circle className="h-3.5 w-3.5 shrink-0" />}
                                    {label}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="h-12 w-full rounded-xl text-sm uppercase tracking-wider">
                        {isSubmitting ? <><Spinner />Saving password...</> : "Save new password"}
                    </Button>
                </form>
            </div>

            <div className="border-t border-brand-200 px-6 py-5">
                <p className="text-center text-sm text-gray-500">
                    Remembered your password?{" "}
                    <Button type="button" variant="link" onClick={onBack} className="h-auto p-0 text-project_primary hover:text-project_primary-foreground">
                        Back to Sign In
                    </Button>
                </p>
            </div>
        </>
    );
}
