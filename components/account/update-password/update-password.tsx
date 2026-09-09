"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, KeyRound, ArrowLeft, X, ChevronLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
    resetPasswordSchema,
    ResetPasswordInput,
} from "@/lib/auth-schema";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface Props {
    email: string;
    onClose: () => void;
    onBack: () => void;
    onCompleted: () => void;
}

export default function UpdatePassword({
    email,
    onClose,
    onBack,
    onCompleted,
}: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
    });

    async function onSubmit(data: ResetPasswordInput) {
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password: data.password,
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                toast.error(result.error);
                return;
            }

            toast.success("Password updated successfully.");

            onCompleted();
        } catch {
            toast.error("Unable to update password.");
        }
    }

    return (
        <>
            {/* Header */}
            <div className="border-b border-brand-200 px-6 py-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={onBack}>
                            <ChevronLeft className="h-5 w-5 cursor-pointer" />
                        </button>

                        <h2 className="font-display text-lg font-medium">Set New Password</h2>
                    </div>

                    <button onClick={onClose}>
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                <h2 className="text-lg text-gray-600 uppercase">
                    Create New Password
                </h2>

                <p className="text-sm text-gray-500">
                    Your identity has been verified.
                    Please create a new password.
                </p>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-6 space-y-5"
                >
                    {/* Password */}

                    <div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-obsidian/60" />

                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="New password"
                                {...register("password")}
                                className="h-11 w-full rounded-full border border-obsidian/10 pl-11 pr-11"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2"
                            >
                                {showPassword
                                    ? <EyeOff size={18} />
                                    : <Eye size={18} />}
                            </button>

                        </div>

                        {errors.password && (
                            <p className="mt-1 text-xs text-project_primary">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Confirm */}

                    <div>
                        <div className="relative">
                            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-obsidian/60" />
                            <input
                                type={showConfirm ? "text" : "password"}
                                placeholder="Confirm password"
                                {...register("confirmPassword")}
                                className="h-11 w-full rounded-full border border-obsidian/10 pl-11 pr-11"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirm(!showConfirm)
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2"
                            >
                                {showConfirm
                                    ? <EyeOff size={18} />
                                    : <Eye size={18} />}
                            </button>

                        </div>

                        {errors.confirmPassword && (
                            <p className="mt-1 text-xs text-project_primary">
                                {errors.confirmPassword.message}
                            </p>
                        )}

                    </div>

                    {/* Requirements */}

                    <div className="rounded-xl bg-brand-50 border border-brand-200 p-4">

                        <p className="font-medium mb-2">
                            Password requirements
                        </p>

                        <ul className="space-y-1 text-sm text-gray-600">
                            <li>• At least 8 characters</li>
                            <li>• One uppercase letter</li>
                            <li>• One lowercase letter</li>
                            <li>• One number</li>
                            <li>• One special character</li>
                        </ul>
                    </div>

                    <Button
                        disabled={isSubmitting}
                        className="h-11 w-full rounded-full"
                    >
                        {isSubmitting
                            ? <>
                                <Spinner />
                                Updating...
                            </>
                            : "Update Password"}
                    </Button>
                </form>
            </div>

            {/* Footer */}

            <div className="border-t border-brand-200 px-6 py-5">
                <p className="text-center text-sm text-gray-500">
                    Remembered your password?{" "}
                    <Button
                        type="button"
                        variant="link"
                        onClick={onBack}
                        className="p-0 h-auto text-project_primary cursor-pointer hover:text-project_primary-foreground"
                    >
                        Back to Sign In
                    </Button>

                </p>

            </div>
        </>
    );
}