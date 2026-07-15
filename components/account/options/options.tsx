"use client";

import { useState } from "react";

import { useAccountOptions } from "@/store/account/options/option";
import { useAddressOptions } from "@/store/address/address";
import { useCart } from "@/store/cart";

import { motion, AnimatePresence } from "framer-motion";
import { X, User, LogOut, ChevronRight, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"

export default function AccountOptions() {
    const { isOpen, closeAccountOptions, handleGoogleSignin, handleCredentialSignIn } = useAccountOptions();
    const { openAddressOptions } = useAddressOptions();
    const { openCart } = useCart();
    const { data: session } = useSession();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const HandleCredentialSignIn = async () => {
        setError("");

        if (!email || !password) {
            setError("Please fill all fields.");
            return;
        }

        setLoading(true);
        const result = await handleCredentialSignIn(email, password);

        setLoading(false);

        if (result?.error) {
            setError(result.error);
            return;
        }

        closeAccountOptions();

        router.refresh();
    }

    const HandleGoogleSignin = () => {
        handleGoogleSignin();
    }

    const options = [
        { id: "address", label: "Address", type: "action", href: "/address" },
        { id: "orders", label: "Orders", type: "link", href: "/orders" },
        { id: "cart", label: "Cart", type: "action", href: "/cart" },
        { id: "wishlist", label: "Wishlist", type: "link", href: "/wishlist" }
    ]

    const handleOptionsActions = (id: string) => {
        switch (id) {
            case "cart":
                closeAccountOptions();
                openCart();
                break;
            case "address":
                closeAccountOptions();
                openAddressOptions();
                break;
        }
    }

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
                                <>
                                    <div className="relative h-44 w-full flex flex-col items-center justify-center overflow-hidden">
                                        <Image
                                            src={session.user.image || "/default-avatar.png"}
                                            alt="Avatar"
                                            width={90}
                                            height={90}
                                            className="relative z-10 rounded-full border-4 border-white shadow-md"
                                        />

                                        <div className="flex items-center justify-center gap-2 pt-6">
                                            <div className="relative z-10 text-base font-semibold text-obsidian capitalize">
                                                {session.user.name}
                                            </div>
                                            <div className="cursor-pointer scale-90 active:scale-70">
                                                <Pencil className="w-4 h-4 text-obsidian/50 inline-block ml-1" />
                                            </div>
                                        </div>

                                        <div className="relative z-10 text-xs text-obsidian/60">
                                            {session.user.email}
                                        </div>
                                    </div>

                                    <div className="divide-y divide-brand-200">
                                        {options.map((option) => {
                                            const content = (
                                                <>
                                                    <span className="text-sm font-medium text-obsidian">
                                                        {option.label}
                                                    </span>
                                                    <ChevronRight className="w-4 h-4 text-obsidian/50 transition-transform duration-200 group-hover:translate-x-1" />
                                                </>
                                            );
                                            if (option.type === "link") {
                                                return (
                                                    <Link
                                                        key={option.id}
                                                        href={option.href}
                                                        className="group flex items-center justify-between px-4 py-4 transition-all duration-200 hover:bg-brand-50 active:scale-[0.98]"
                                                    >
                                                        {content}
                                                    </Link>
                                                );
                                            }
                                            return (
                                                <button
                                                    key={option.id}
                                                    onClick={() => handleOptionsActions(option.id)}
                                                    className="group flex w-full items-center justify-between px-4 py-4 text-left transition-all duration-200 hover:bg-brand-50 active:scale-[0.98]"
                                                >
                                                    {content}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </>
                            ) : (
                                // Not logged in UI
                                <div>
                                    <p className="text-md text-gray-600">
                                        Hello, Welcome Back!
                                    </p>

                                    <p className="text-xs text-gray-600">
                                        Use your credentials below and start shopping with us.
                                    </p>

                                    <div className="my-6 space-y-4">
                                        <p className="text-lg text-gray-600 uppercase">
                                            Sign In
                                        </p>
                                        {/* Email */}
                                        <div>
                                            <label className="text-sm">Email</label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
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
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
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

                                        <Button disabled={loading} onClick={HandleCredentialSignIn} className="text-sm w-full py-6 bg-project_primary hover:bg-project_primary-foreground text-white transition-colors cursor-pointer uppercase">
                                            {loading ? "Signing In..." : "Sign In"}
                                        </Button>

                                        {/* Divider */}
                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                            <div className="flex-1 h-px bg-gray-300"></div>
                                            OR
                                            <div className="flex-1 h-px bg-gray-300"></div>
                                        </div>

                                        {/* Social Login */}
                                        <Button onClick={HandleGoogleSignin} className="text-sm w-full py-6 bg-obsidian hover:bg-obsidian/90 text-ivory transition-colors cursor-pointer uppercase">
                                            {/* Google Icon */}
                                            <svg width="64px" height="64px" viewBox="-0.5 0 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                                <g id="SVGRepo_iconCarrier">
                                                    <title>Google-color</title>
                                                    <desc>Created with Sketch.</desc>
                                                    <defs> </defs>
                                                    <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                        <g id="Color-" transform="translate(-401.000000, -860.000000)">
                                                            <g id="Google" transform="translate(401.000000, 860.000000)">
                                                                <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" id="Fill-1" fill="#FBBC05"> </path>
                                                                <path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" id="Fill-2" fill="#EB4335"> </path>
                                                                <path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" id="Fill-3" fill="#34A853"> </path>
                                                                <path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" id="Fill-4" fill="#4285F4"> </path>
                                                            </g>
                                                        </g>
                                                    </g>
                                                </g>
                                            </svg>
                                            Continue with Google
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-5 border-t border-brand-200 space-y-4">
                            {session?.user ? (
                                <Button
                                    onClick={() => signOut()}
                                    className="text-sm w-full py-6 bg-project_primary hover:bg-project_primary-foreground text-white transition-colors cursor-pointer uppercase"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Sign Out
                                </Button>
                            ) : (
                                <div>
                                    <div className="flex items-center justify-center gap-1 text-sm">
                                        <span className="text-gray-500">
                                            New to Akshat Namkeen?
                                        </span>
                                        <Link
                                            href="/signup"
                                            className="text-project_primary hover:underline uppercase"
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                    <div>

                                    </div>
                                    <span className="text-gray-500 text-xs">
                                        Create an account to save addresses,
                                        track orders, and checkout faster.
                                    </span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )
            }
        </AnimatePresence >
    );
}