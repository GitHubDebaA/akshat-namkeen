"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, Pen, X } from "lucide-react";
import { toast } from "sonner";

import { Spinner } from "@/components/ui/spinner";
import OtpInput from "./otp-input";

import { maskEmail } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Props {
    email: string;
    onBack: () => void;
    onClose: () => void;
    onVerified: () => void;
    onSignup: () => void;
}

export default function VerifyOtp({
    email,
    onBack,
    onClose,
    onVerified,
    onSignup
}: Props) {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [resending, setResending] = useState(false);

    useEffect(() => {
        if (countdown === 0) return;

        const timer = setTimeout(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown]);

    const verifyOtp = useCallback(async () => {
        if (otp.length !== 6 || loading) return;
        setLoading(true);

        try {
            const response = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    email,
                    otp,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error ?? "Unable to verify OTP.");
                // Clear OTP only when it is invalid
                if (data.error) {
                    setOtp("");
                }
                return;
            }

            toast.success("OTP verified successfully.");
            onVerified();
        } catch (error) {
            console.error(error);
            toast.error(
                "Unable to connect to the server. Please try again."
            );
            setOtp("");
        } finally {
            setLoading(false);
        }
    }, [email, otp, onVerified, loading]);

    useEffect(() => {
        if (otp.length === 6) {
            verifyOtp();
        }
    }, [otp, verifyOtp]);

    async function resendOtp() {
        if (countdown > 0 || resending) return;
        setResending(true);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error ?? "Unable to send OTP.");
                return;
            }

            toast.success("A new verification code has been sent.");

            setOtp("");
            setCountdown(60);
        } catch (error) {
            console.error(error);
            toast.error(
                "Unable to connect to the server. Please try again."
            );
        } finally {
            setResending(false);
        }
    }

    return (
        <>
            {/* Header */}
            <div className="border-b border-brand-200 px-6 py-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={onBack}>
                            <ChevronLeft className="w-5 h-5 cursor-pointer" />
                        </button>
                        <h2 className="font-display text-lg font-medium">Verify OTP</h2>
                    </div>

                    <button onClick={onClose}>
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                <h2 className="text-lg text-gray-600 uppercase">
                    Confirm your Email
                </h2>

                <div>
                    <p className="text-sm text-gray-500">
                        Enter the code we send to the email. Varification code is valid upto 5 minute.
                    </p>

                    <p className="font-medium">
                        {maskEmail(email)}
                    </p>
                </div>

                <Button onClick={onBack} variant="link" className="p-0 m-0 text-project_primary cursor-pointer hover:text-project_primary-foreground">
                    <Pen className="w-5 h-5"></Pen>
                    Change Email
                </Button>

                <div className="mt-8">
                    <OtpInput
                        value={otp}
                        onChange={setOtp}
                        disabled={loading}
                    />
                </div>

                <div className="text-right">
                    {countdown > 0 ? (
                        <p className="text-sm text-gray-500">
                            Resend in{" "}
                            <span className="font-semibold">
                                00:{countdown.toString().padStart(2, "0")}
                            </span>
                        </p>
                    ) : (
                        <Button
                            type="button"
                            variant="link"
                            disabled={countdown > 0 || resending}
                            onClick={resendOtp}
                            className="
                                p-0
                                h-auto
                                text-project_primary
                                font-medium
                                cursor-pointer
                                hover:underline
                                hover:text-project_primary-foreground
                            "
                        >
                            {resending
                                ? "Sending..."
                                : countdown > 0
                                    ? `Resend in ${countdown}s`
                                    : "Resend OTP"}
                        </Button>
                    )}
                </div>

                {loading && (
                    <div className="mt-8 flex justify-center items-center gap-2">
                        <Spinner />
                        <span>Verifying...</span>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="border-t border-brand-200 px-6 py-6">
                <div className="flex items-center justify-center gap-1 text-sm">
                    <span className="text-gray-500">
                        Remembered your password?
                    </span>
                    <Button
                        variant="link"
                        onClick={onSignup}
                        className="p-0 h-auto text-project_primary cursor-pointer hover:text-project_primary-foreground"
                    >
                        Sign In
                    </Button>
                </div>
            </div>
        </>
    );
}