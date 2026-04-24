"use client";

import { useState } from "react";
import Logo from "@/components/Logo";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex h-screen w-full">

            {/* LEFT SECTION */}
            <div className="w-1/2 bg-gradient-to-br from-red-900 to-red-400 text-white flex flex-col justify-center px-16">
                <h1 className="text-4xl font-semibold leading-tight">
                    Join Akshat Namkeen
                </h1>

                <p className="mt-6 text-lg text-gray-200">
                    Create your account to explore authentic namkeen, snacks, and exclusive offers tailored just for you.
                </p>
            </div>

            {/* RIGHT SECTION */}
            <div className="w-1/2 flex items-center justify-center bg-gray-50 px-10">
                <div className="w-full max-w-md space-y-4">

                    {/* Logo */}
                    <Logo />

                    {/* Heading */}
                    <div>
                        <h1 className="text-2xl font-black mt-2">Create Account</h1>
                        <p className="text-sm text-gray-500 mt-2">
                            Sign up to get started with your journey.
                        </p>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="text-sm">Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            className="w-full mt-1 px-4 py-3 border rounded-lg 
                            focus:outline-none focus:ring-2 focus:ring-project-primary 
                            focus:border-project-primary"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-sm">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full mt-1 px-4 py-3 border rounded-lg 
                            focus:outline-none focus:ring-2 focus:ring-project-primary 
                            focus:border-project-primary"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-sm">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a password"
                                className="w-full mt-1 px-4 py-3 border rounded-lg 
                                focus:outline-none focus:ring-2 focus:ring-project-primary 
                                focus:border-project-primary"
                            />

                            {showPassword ? (
                                <EyeOff
                                    onClick={() => setShowPassword(false)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 
                                    text-gray-500 w-5 h-5 cursor-pointer 
                                    hover:text-project-primary transition-transform duration-100 active:scale-90"
                                />
                            ) : (
                                <Eye
                                    onClick={() => setShowPassword(true)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 
                                    text-gray-500 w-5 h-5 cursor-pointer 
                                    hover:text-project-primary transition-transform duration-100 active:scale-90"
                                />
                            )}
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="text-sm">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Confirm your password"
                            className="w-full mt-1 px-4 py-3 border rounded-lg 
                            focus:outline-none focus:ring-2 focus:ring-project-primary 
                            focus:border-project-primary"
                        />
                    </div>

                    {/* Button */}
                    <Button
                        size="lg"
                        className="w-full bg-project-primary hover:bg-project-primary/90 
                        transition-all duration-150 rounded-md cursor-pointer"
                    >
                        Sign Up
                    </Button>

                    {/* Divider */}
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        OR
                        <div className="flex-1 h-px bg-gray-300"></div>
                    </div>

                    {/* Social Login */}
                    <button className="w-full border py-3 rounded-lg hover:bg-gray-100">
                        Continue with Google
                    </button>

                    <button className="w-full border py-3 rounded-lg hover:bg-gray-100">
                        Continue with Apple
                    </button>

                    {/* Signin Redirect */}
                    <p className="text-sm text-center">
                        Already have an account?{" "}
                        <span className="text-project-primary cursor-pointer hover:text-project-primary-foreground transition-colors">
                            Sign In
                        </span>
                    </p>

                </div>
            </div>
        </div>
    );
}