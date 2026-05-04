"use client";

import { useAccountOptions } from "@/store/account/options/option";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ArrowRight, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react"

export default function AccountOptions() {
    const { isOpen, openAccountOptions, closeAccountOptions, toggleAccountOptions } = useAccountOptions();
    const { data: session } = useSession();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeAccountOptions}
                        className="fixed inset-0 bg-obsidian/40 backdrop-blur-sm z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 350, damping: 35 }}
                        className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-ivory z-50 flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-brand-200">
                            <div className="flex items-center gap-3">
                                <User className="w-5 h-5 text-obsidian" />
                                <h2 className="font-display text-lg font-medium">Account Details</h2>
                            </div>
                            <button
                                onClick={closeAccountOptions}
                                className="p-2 rounded-full hover:bg-brand-100 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                            {session?.user ? (
                                // ✅ Logged-in UI
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={session.user.image || "/default-avatar.png"}
                                        alt="Avatar"
                                        width={40}
                                        height={40}
                                        className="rounded-full border"
                                    />

                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-project_primary">
                                            Hello, {session.user.name}
                                        </span>
                                        <span className="text-xs text-project_primary-foreground">
                                            {session.user.email}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                // Not logged in UI
                                <div>
                                    <p className="text-md text-gray-600">
                                        Hello, Welcome Back!
                                    </p>

                                    <p className="text-xs text-gray-600">
                                        Use your credentials below and start shopping with us.
                                    </p>

                                    <div className="my-6">
                                        <p className="text-lg text-gray-600">
                                            Sign In
                                        </p>
                                        {/* Email */}
                                        <div>
                                            <label className="text-sm">Email</label>
                                            <input
                                                type="email"
                                                placeholder="Enter your email"
                                                className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-project_primary-foreground"
                                            />
                                        </div>

                                        {/* Password */}
                                        <div>
                                            <label className="text-sm">Password</label>
                                            <div className="relative">
                                                <input
                                                    type="password"
                                                    placeholder="Enter your password"
                                                    className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-project_primary-foreground"
                                                />
                                            </div>
                                            <div className="text-right mt-1">
                                                <Link href="/forgot-password" className="text-sm text-project_primary hover:underline hover:text-project_primary-foreground">
                                                    Forgot Password?
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    <Link href="/signin">
                                        <Button className="w-full bg-project_primary hover:bg-project_primary-foreground">
                                            Sign In
                                        </Button>
                                    </Link>

                                    <div className="flex items-center justify-center gap-1 text-xs">
                                        <span className="text-gray-500">
                                            {"Don't have an account?"}
                                        </span>
                                        <Link
                                            href="/signup"
                                            className="text-project_primary hover:underline"
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-5 border-t border-brand-200 space-y-4">
                            <button
                                className="w-full py-2 px-4 bg-brand-100 hover:bg-brand-200 text-brand-800 hover:text-brand-900 transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}