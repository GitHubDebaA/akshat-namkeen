import { z } from "zod";

// Sign In
export const signInSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Email is required.")
        .email("Please enter a valid email address."),

    password: z
        .string()
        .min(1, "Password is required.")
        .min(8, "Password must be at least 8 characters."),
});

export type SignInInput = z.infer<typeof signInSchema>;

//Forgot Password
export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Email is required.")
        .email("Please enter a valid email address."),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

//Verify OTP
export const verifyOtpSchema = z.object({
    otp: z
        .string()
        .trim()
        .length(6, "OTP must be 6 digits.")
        .regex(/^\d+$/, "OTP must contain only numbers."),
});

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

// Setup new password
export const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(8, "Password must be at least 8 characters.")
            .regex(/[A-Z]/, "Must contain one uppercase letter.")
            .regex(/[a-z]/, "Must contain one lowercase letter.")
            .regex(/[0-9]/, "Must contain one number.")
            .regex(/[^A-Za-z0-9]/, "Must contain one special character."),

        confirmPassword: z
            .string()
            .min(1, "Please confirm your password."),
    })
    .refine(
        (data) => data.password === data.confirmPassword,
        {
            path: ["confirmPassword"],
            message: "Passwords do not match.",
        }
    );

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;