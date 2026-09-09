"use client";

import { signIn } from "next-auth/react";
import { Eye, EyeOff, Mail, Lock, X, LogIn } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, SignInInput } from "@/lib/auth-schema";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import GoogleIcon from "@/components/icons/google-icon";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

interface ChildProps {
    onClose: () => void;
    handleForgotPassword: () => void;
}

const AUTH_ERRORS: Record<string, string> = {
    CredentialsSignin: "Invalid email or password.",
    AccessDenied: "You don't have permission to sign in.",
    OAuthSignin: "Unable to sign in with Google. Please try again.",
    OAuthCallback: "Google authentication failed.",
    OAuthCreateAccount: "Unable to create your account.",
    EmailCreateAccount: "Unable to create your account.",
    Callback: "Authentication failed. Please try again.",
    Configuration: "Authentication service is unavailable.",
    Verification: "Verification link has expired.",
    Default: "Something went wrong. Please try again.",
};

export default function SignIn({ onClose, handleForgotPassword }: ChildProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInInput>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: SignInInput) => {
        try {
            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (result?.error) {
                const errorMessage = AUTH_ERRORS[result.error] ?? AUTH_ERRORS.Default;
                toast.error(errorMessage);
                return;
            }
            toast.success('Sign in successfully.');  
            onClose();
        } catch (error) {
            console.error(error);
            const errorMessage = "Unable to connect to the server. Please check your internet connection and try again.";
            toast.error(errorMessage);
        }
    };

    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            {/* Header */}
            <div className="border-b border-brand-200 px-6 py-5">
                <div className="flex items-center justify-between" >
                    <div className="flex items-center gap-3">
                        <h2 className="font-display text-lg font-medium">Welcome Back</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-brand-100 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="text-sm text-gray-500">
                    Sign in to continue shopping delicious snacks.
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                <p className="text-lg text-gray-600 uppercase">
                    Sign In
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

                    <div>
                        {/* <label className="text-sm font-medium">Password</label> */}
                        <div className="relative">
                            <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-obsidian/60 
                                ${errors.password ? "text-project_primary" : ""}`} />

                            <input
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                {...register("password")}
                                className={`h-11 w-full rounded-full border border-obsidian/10 bg-white text-obsidian/60 pl-11 pr-4 outline-none transition focus:ring-obsidian/10 focus:ring-2
                                    ${errors.password ? "border-project_primary focus:ring-project_primary" : ""}`}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                            >
                                {showPassword ? (
                                    <EyeOff className={`h-4 w-4 ${errors.password ? "text-project_primary" : "text-obsidian/60"}`} />
                                ) : (
                                    <Eye className={`h-4 w-4 ${errors.password ? "text-project_primary" : "text-obsidian/60"}`} />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-xs text-project_primary">{errors.password.message}</p>
                        )}

                        <div className="text-right">
                            <Button
                                variant="link"
                                className="text-sm text-project_primary cursor-pointer"
                                onClick={handleForgotPassword}
                            >
                                Forgot Password
                            </Button>
                        </div>
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
                                    <LogIn className="w-5 h-5" />
                                )
                            }
                            {isSubmitting ? "Signing In..." : "Sign In"}
                        </span>
                    </Button>
                </form>

                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-obsidian/30" />
                    <span className="text-xs uppercase tracking-widest text-obsidian/50">
                        OR
                    </span>
                    <div className="h-px flex-1 bg-obsidian/30" />
                </div>

                <Button
                    type="button"
                    variant="outline"
                    className="relative overflow-hidden h-11 w-full rounded-full bg-white text-obsidian uppercase text-sm font-medium tracking-wide cursor-pointer transition-all duration-300 group/button hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
                    onClick={() => signIn("google")}
                >
                    <span className="absolute inset-0 bg-black/5 scale-x-0 origin-left transition-transform duration-300 group-hover/button:scale-x-100"></span>
                    <span className="relative z-10 flex items-center justify-center gap-3">
                        {/* Google Icon */}
                        <GoogleIcon></GoogleIcon>
                        Continue with Google
                    </span>
                </Button>
            </div >

            <div className="px-6 py-5 border-t border-brand-200 space-y-1">
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
                <span className="text-gray-500 text-xs">
                    Create an account to save addresses,
                    track orders, and checkout faster.
                </span>
            </div>
        </>
    );
}