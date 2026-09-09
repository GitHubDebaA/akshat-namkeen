"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, ForgotPasswordInput } from "@/lib/auth-schema";

//import lucide react icons
import { X, Mail, SendHorizontal, ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

interface ChildProps {
    onClose: () => void;
    onBack: () => void;
    onSendOTP: (email: string) => void;
}

export default function ForgotPassword({ onClose, onBack, onSendOTP }: ChildProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordInput) => {
        const result = await fetch("/api/auth/forgot-password", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!result.ok) {
            toast.error("Unable to send OTP.");
            return;
        }

        toast.success("OTP sent successfully.");
        onSendOTP(data.email);
    };

    return (
        <>
            {/* Header */}
            <div className="border-b border-brand-200 px-6 py-5">
                <div className="flex items-center justify-between" >
                    <div className="flex items-center gap-3">
                        <ChevronLeft
                            className="w-5 h-5 cursor-pointer"
                            onClick={onBack}
                        />
                        <h2 className="font-display text-lg font-medium">Forgot Password</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-brand-100 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                <p className="text-lg text-gray-600 uppercase">
                    Your Email Address!
                </p>
                <p className="text-sm">
                    {`Enter your email address, we'll send you a OTP Verification Code.`}
                </p>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                    noValidate
                >
                    <div>
                        {/* <label className="mb-2 block text-sm font-medium">Email</label> */}
                        <div className="relative">
                            <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-obsidian/60 
                                ${errors.email ? "text-project_primary" : ""}`} />
                            <input
                                id="email"
                                type="email"
                                {...register("email")}
                                autoComplete="email"
                                placeholder="Enter your email"
                                className={`h-11 w-full rounded-full border border-obsidian/10 bg-white text-obsidian/60 pl-11 pr-4 outline-none transition focus:ring-obsidian/10 focus:ring-2
                                    ${errors.email ? "border-project_primary focus:ring-project_primary" : ""}`}
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-xs text-project_primary">{errors.email.message}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="relative overflow-hidden h-11 w-full rounded-full bg-project_primary text-white uppercase text-sm font-medium tracking-wide cursor-pointer transition-all duration-300 group/button hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
                        disabled={isSubmitting}
                    >
                        <span className="absolute inset-0 bg-project_primary-foreground scale-x-0 origin-left transition-transform duration-300 group-hover/button:scale-x-100"></span>
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            {
                                isSubmitting ? (
                                    <Spinner />
                                ) : (
                                    <SendHorizontal className="w-5 h-5" />
                                )
                            }
                            {isSubmitting ? "Sending OTP..." : "Send OTP"}
                        </span>
                    </Button>
                </form>
            </div >

            <div className="px-6 py-5 border-t border-brand-200 space-y-1">
                <div className="flex items-center justify-center gap-1 text-sm">
                    <span className="text-gray-500">
                        Remembered your password?
                    </span>
                    <Button
                        variant="link"
                        onClick={onBack}
                        className="p-0 h-auto text-project_primary cursor-pointer hover:text-project_primary-foreground"
                    >
                        Sign In
                    </Button>
                </div>
            </div>
        </>
    );
}