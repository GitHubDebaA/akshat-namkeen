"use client";

import { useState } from "react";
import Logo from "@/components/Logo";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signIn } from "next-auth/react"

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const HandleGoogleSignin = async () => {
        try {
            await signIn("google", {
                callbackUrl: "/",
            });
        } catch (error) {
            console.error("Google Sign-In Error:", error);
        }
    }

    const handleCredentialsSignin = async () => {
        setError(null);
        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            console.log("Credentials Sign-In Result:", result);

            if (result?.error) {
                setError(result.error);
            } else {
                window.location.href = "/";
            }
        } catch (error) {
            console.error("Credentials Sign-In Error:", error);
            setError("An unexpected error occurred. Please try again.");
        }
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
                        <h1 className="text-2xl font-black mt-2">Welcome Back!</h1>
                        <p className="text-sm text-gray-500 mt-2">
                            Sign in to access your dashboard and continue.
                        </p>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-sm">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-project_primary-foreground"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-sm">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-project_primary-foreground"
                            />

                            {showPassword ? (
                                <EyeOff
                                    onClick={() => setShowPassword(false)}
                                    className="absolute right-3 top-5 text-gray-500 w-5 h-5 cursor-pointer hover:text-project_primary-foreground transition-transform duration-100 active:scale-90"
                                />
                            ) : (
                                <Eye
                                    onClick={() => setShowPassword(true)}
                                    className="absolute right-3 top-5 text-gray-500 w-5 h-5 cursor-pointer hover:text-project_primary-foreground transition-transform duration-100 active:scale-90"
                                />
                            )}
                        </div>
                        <div className="text-right mt-1">
                            <Link href="/forgot-password" className="text-sm text-project_primary hover:underline hover:text-project_primary-foreground">
                                Forgot Password?
                            </Link>
                        </div>
                    </div>

                    {/* Button */}
                    <Button
                        size="lg"
                        className="w-full bg-project_primary hover:bg-project_primary-foreground transition-all duration-150 rounded-md cursor-pointer"
                        onClick={handleCredentialsSignin}
                    >
                        Sign In
                    </Button>
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    {/* Divider */}
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        OR
                        <div className="flex-1 h-px bg-gray-300"></div>
                    </div>

                    {/* Social Login */}
                    <Button className="w-full border-project_primary bg-white text-project_primary hover:bg-project_primary-foreground hover:text-white transition-all duration-150 rounded-md cursor-pointer" onClick={HandleGoogleSignin}>
                        Continue with Google
                    </Button>

                    {/* Signup */}
                    <p className="text-sm text-center">
                        Don’t have an account?{" "}
                        <Link href="/signup" className="text-project_primary hover:underline hover:text-project_primary-foreground transition-colors">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}