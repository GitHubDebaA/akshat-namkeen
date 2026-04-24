"use client";

import { useState } from "react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSendOTP = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error);
            } else {
                setStep(2);
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
            setError("An error occurred. Please try again. ");
        } finally {
            setLoading(false);
        }
    }

    const handleVerifyOTP = async () => {
        setLoading(true);
        setError("");

        const res = await fetch("/api/auth/verify-otp", {
            method: "POST",
            body: JSON.stringify({ email, otp }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error);
        } else {
            setStep(3);
        }

        setLoading(false);
    }

    const handleResetPassword = async () => {
        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }

        setLoading(true);
        setError("");

        const res = await fetch("/api/auth/reset-password", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error);
        } else {
            setStep(4);
        }

        setLoading(false);
    }

    return (
        <div className="flex h-screen w-full">

            {/* LEFT SECTION */}
            <div className="w-1/2 bg-gradient-to-br from-red-900 to-red-400 text-white flex flex-col justify-center px-16">

                <h1 className="text-4xl font-semibold leading-tight">
                    Akshat Namkeen
                </h1>

                <p className="mt-6 text-lg text-gray-200">
                    Your platform to explore authenticate namkeen, snacks, and more. Sign in to access your personalized dashboard and continue your flavorful journey with us.
                </p>
            </div>

            {/* RIGHT SECTION */}
            <div className="w-1/2 flex items-center justify-center bg-gray-50 px-10">
                <div className="w-full max-w-md space-y-6">

                    {/* Logo */}
                    <Logo />

                    {/* Heading */}
                    <div>
                        <h1 className="text-2xl font-black mt-2">Forgot your Password?</h1>
                    </div>

                    {step === 1 && (
                        <div>
                            <p className="text-gray-600 text-sm mb-4">Enter your email and {"we'll"} send you an OTP to reset your password.</p>

                            <div>
                                <label className="text-sm">Email</label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-project_primary-foreground"
                                />

                                <Button
                                    size="lg"
                                    className="w-full mt-4 bg-project_primary hover:bg-project_primary-foreground transition-all duration-150 rounded-md cursor-pointer"
                                    onClick={handleSendOTP}
                                    disabled={loading}
                                >
                                    {loading ? "Sending..." : "Send OTP"}
                                </Button>

                                {error && (
                                    <p className="text-red-500 text-sm text-center">{error}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <p className="text-gray-600 text-sm mb-4">We emailed you the six digit code to reset your password.</p>

                            <div>
                                <label className="text-sm">OTP</label>
                                <input
                                    type="text"
                                    placeholder="Enter the OTP"
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-project_primary-foreground"
                                />

                                <Button
                                    size="lg"
                                    className="w-full bg-project_primary hover:bg-project_primary-foreground transition-all duration-150 rounded-md cursor-pointer"
                                    onClick={handleVerifyOTP}
                                    disabled={loading}
                                >
                                    {loading ? "Verifying..." : "Verify OTP"}
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <p className="text-gray-600 text-sm mb-4">Enter your new password below.</p>

                            <div>
                                <label className="text-sm">New Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter your new password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-project_primary-foreground"
                                />

                                <label className="text-sm mt-4">Confirm New Password</label>
                                <input
                                    type="password"
                                    placeholder="Confirm your new password"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-project_primary-foreground"
                                />

                                <Button
                                    size="lg"
                                    className="w-full bg-project_primary hover:bg-project_primary-foreground transition-all duration-150 rounded-md cursor-pointer"
                                    onClick={handleResetPassword}
                                    disabled={loading}
                                >
                                    {loading ? "Resetting..." : "Reset Password"}
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Password Reset Successful!</h2>
                            <p className="text-gray-600 text-sm mb-6">Your password has been reset successfully. You can now sign in with your new password.</p>

                            <Button
                                size="lg"
                                className="w-full bg-project_primary hover:bg-project_primary-foreground transition-all duration-150 rounded-md cursor-pointer"
                                onClick={() => window.location.href = "/signin"}
                            >
                                Back to Sign In
                            </Button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}