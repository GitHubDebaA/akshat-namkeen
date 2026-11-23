"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, UserRound, Mail, Lock, UserPlus, X } from "lucide-react";
import Link from "next/link";
import { signUpSchema, type SignUpInput } from "@/lib/auth-schema";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import GoogleIcon from "@/components/icons/google-icon";
import { toast } from "sonner";

type SignUpProps = {
    onClose?: () => void;
    onSignIn?: () => void;
};

export default function SignUp({ onClose, onSignIn }: SignUpProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [pendingSignup, setPendingSignup] = useState<SignUpInput | null>(null);
    const [step, setStep] = useState<"details" | "verify">("details");
    const [verificationCode, setVerificationCode] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [resending, setResending] = useState(false);
    const [resendCountdown, setResendCountdown] = useState(60);
    const { update } = useSession();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpInput>({
        resolver: zodResolver(signUpSchema),
        defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    });

    useEffect(() => {
        if (step !== "verify" || resendCountdown <= 0) return;
        const timer = window.setTimeout(() => setResendCountdown((seconds) => seconds - 1), 1000);
        return () => window.clearTimeout(timer);
    }, [step, resendCountdown]);

    const submit = async (data: SignUpInput) => {
        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (!response.ok) {
                toast.error(result.error ?? "Unable to create your account.");
                return;
            }
            setPendingSignup(data);
            setVerificationCode("");
            setResendCountdown(typeof result.retryAfter === "number" ? result.retryAfter : 60);
            setStep("verify");
            toast.success("We sent a verification code to your email.");
        } catch (error) {
            console.error("Sign up failed:", error);
            toast.error("Unable to send a verification code. Please try again.");
        }
    };

    const verifyEmail = async () => {
        if (!pendingSignup || verificationCode.length !== 6 || verifying) return;
        setVerifying(true);
        try {
            const response = await fetch("/api/auth/verify-signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: pendingSignup.email, code: verificationCode }),
            });
            const result = await response.json();
            if (!response.ok) {
                toast.error(result.error ?? "Unable to verify your email.");
                return;
            }

            const signInResult = await signIn("credentials", {
                email: pendingSignup.email,
                password: pendingSignup.password,
                redirect: false,
            });
            if (signInResult?.ok) {
                await update();
                toast.success("Email verified. Welcome to Akshat Namkeen!");
                if (!onClose) window.location.assign("/");
                return;
            }

            toast.success("Email verified and account created. Sign in to continue.");
            if (onSignIn) onSignIn();
            else window.location.assign("/signin");
        } catch (error) {
            console.error("Email verification failed:", error);
            toast.error("Unable to verify your email right now. Please try again.");
        } finally {
            setVerifying(false);
        }
    };

    const resendCode = async () => {
        if (!pendingSignup || resendCountdown > 0 || resending) return;
        setResending(true);
        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pendingSignup),
            });
            const result = await response.json();
            if (!response.ok) {
                toast.error(result.error ?? "Unable to send another code.");
                if (typeof result.retryAfter === "number") setResendCountdown(result.retryAfter);
                return;
            }
            setVerificationCode("");
            setResendCountdown(60);
            toast.success("A new verification code has been sent.");
        } catch {
            toast.error("Unable to send another code. Please try again.");
        } finally {
            setResending(false);
        }
    };

    const inputClass = (invalid: boolean) => `h-11 w-full rounded-full border bg-white pl-11 pr-4 text-obsidian outline-none transition focus:ring-2 ${invalid ? "border-project_primary focus:ring-project_primary" : "border-obsidian/10 focus:ring-obsidian/10"}`;

    return <>
        <div className="border-b border-brand-200 px-6 py-5">
            <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-medium">{step === "verify" ? "Verify your email" : "Create your account"}</h2>
                {onClose && <button type="button" onClick={onClose} aria-label="Close sign up" className="rounded-full p-2 transition-colors hover:bg-brand-100"><X className="h-4 w-4" /></button>}
            </div>
            <p className="text-sm text-gray-500">{step === "verify" ? "Confirm your email address to finish signing up." : "Join Akshat Namkeen and make checkout faster."}</p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
            {step === "details" ? <>
            <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
                <p className="text-lg uppercase text-gray-600">Sign Up</p>
                <div>
                    <div className="relative"><UserRound className={`absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${errors.name ? "text-project_primary" : "text-obsidian/60"}`} /><input {...register("name")} autoComplete="name" placeholder="Full name" aria-invalid={!!errors.name} className={inputClass(!!errors.name)} /></div>
                    {errors.name && <p className="mt-1 text-xs text-project_primary">{errors.name.message}</p>}
                </div>
                <div>
                    <div className="relative"><Mail className={`absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${errors.email ? "text-project_primary" : "text-obsidian/60"}`} /><input {...register("email")} type="email" autoComplete="email" placeholder="Email address" aria-invalid={!!errors.email} className={inputClass(!!errors.email)} /></div>
                    {errors.email && <p className="mt-1 text-xs text-project_primary">{errors.email.message}</p>}
                </div>
                <div>
                    <div className="relative"><Lock className={`absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${errors.password ? "text-project_primary" : "text-obsidian/60"}`} /><input {...register("password")} type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Create a password" aria-invalid={!!errors.password} className={`${inputClass(!!errors.password)} pr-12`} /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-4 top-1/2 -translate-y-1/2">{showPassword ? <EyeOff className="h-4 w-4 text-obsidian/60" /> : <Eye className="h-4 w-4 text-obsidian/60" />}</button></div>
                    {errors.password && <p className="mt-1 text-xs text-project_primary">{errors.password.message}</p>}
                    <p className="mt-1 text-xs text-gray-500">Use 8+ characters with uppercase, lowercase, number, and symbol.</p>
                </div>
                <div>
                    <div className="relative"><Lock className={`absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${errors.confirmPassword ? "text-project_primary" : "text-obsidian/60"}`} /><input {...register("confirmPassword")} type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Confirm your password" aria-invalid={!!errors.confirmPassword} className={inputClass(!!errors.confirmPassword)} /></div>
                    {errors.confirmPassword && <p className="mt-1 text-xs text-project_primary">{errors.confirmPassword.message}</p>}
                </div>
                <Button type="submit" disabled={isSubmitting} className="h-11 w-full rounded-full bg-project_primary uppercase tracking-wide text-white">
                    <span className="flex items-center justify-center gap-3">{isSubmitting ? <Spinner /> : <UserPlus className="h-5 w-5" />}{isSubmitting ? "Creating Account..." : "Create Account"}</span>
                </Button>
            </form>

            <div className="my-4 flex items-center gap-4"><div className="h-px flex-1 bg-obsidian/30" /><span className="text-xs uppercase tracking-widest text-obsidian/50">OR</span><div className="h-px flex-1 bg-obsidian/30" /></div>
            <Button type="button" variant="outline" className="h-11 w-full rounded-full bg-white uppercase tracking-wide text-obsidian" onClick={() => signIn("google", { callbackUrl: "/" })}><span className="flex items-center justify-center gap-3"><GoogleIcon />Continue with Google</span></Button>
            </> : <div className="space-y-5 py-4">
                <div className="rounded-2xl border border-brand-200 bg-brand-50/70 p-5 text-center">
                    <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-project_primary shadow-sm"><Mail className="h-5 w-5" /></span>
                    <h3 className="font-display text-lg font-medium text-obsidian">Check your inbox</h3>
                    <p className="mt-2 text-sm text-obsidian/65">Enter the six-digit code we sent to</p>
                    <p className="mt-1 break-all text-sm font-semibold text-obsidian">{pendingSignup?.email}</p>
                </div>
                <label htmlFor="signup-verification-code" className="block text-sm font-medium text-obsidian">Verification code</label>
                <input
                    id="signup-verification-code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Enter 6-digit code"
                    className="h-12 w-full rounded-xl border border-brand-200 bg-white px-4 text-center text-lg font-semibold tracking-[0.45em] shadow-sm outline-none focus:border-project_primary focus:ring-2 focus:ring-project_primary/20"
                />
                <Button type="button" onClick={verifyEmail} disabled={verificationCode.length !== 6 || verifying} className="h-11 w-full rounded-full bg-project_primary uppercase tracking-wide text-white">
                    <span className="flex items-center justify-center gap-3">{verifying ? <Spinner /> : <CheckCircle2 className="h-5 w-5" />}{verifying ? "Verifying..." : "Verify email & create account"}</span>
                </Button>
                <div className="flex items-center justify-between text-sm">
                    <button type="button" onClick={() => { setStep("details"); setVerificationCode(""); }} className="inline-flex items-center gap-1 text-obsidian/60 hover:text-project_primary"><ArrowLeft className="h-4 w-4" />Edit details</button>
                    <button type="button" onClick={resendCode} disabled={resendCountdown > 0 || resending} className="font-medium text-project_primary disabled:cursor-not-allowed disabled:text-obsidian/40">
                        {resending ? "Sending..." : resendCountdown > 0 ? `Resend in ${resendCountdown}s` : "Resend code"}
                    </button>
                </div>
            </div>}
        </div>

        <div className="border-t border-brand-200 px-6 py-5 text-center text-sm">
            <span className="text-gray-500">Already have an account? </span>
            {step === "verify" ? <Link href="/signin" className="uppercase text-project_primary hover:underline">Sign In</Link> : onSignIn ? <button type="button" onClick={onSignIn} className="uppercase text-project_primary hover:underline">Sign In</button> : <Link href="/signin" className="uppercase text-project_primary hover:underline">Sign In</Link>}
        </div>
    </>;
}
