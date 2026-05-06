"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { signIn } from "next-auth/react"

type AccountOption = {
    isOpen: boolean;
    openAccountOptions: () => void;
    closeAccountOptions: () => void;
    toggleAccountOptions: () => void;
    handleGoogleSignin: () => void;
    handleCredentialSignIn: (email: string, password: string) => void;
}

export const useAccountOptions = create<AccountOption>()(
    persist(
        (set) => ({
            isOpen: false,

            openAccountOptions: () => set({ isOpen: true }),
            closeAccountOptions: () => set({ isOpen: false }),
            toggleAccountOptions: () => set((state) => ({ isOpen: !state.isOpen })),
            handleGoogleSignin: async () => {
                try {
                    await signIn("google", {
                        callbackUrl: "/",
                    });
                } catch (error) {
                    console.error("Google Sign-In Error:", error);
                }
            },
            handleCredentialSignIn: async (email: string, password: string) => {
                try {
                    const result = await signIn("credentials", {
                        email,
                        password,
                        redirect: false,
                    });

                    console.log("Credentials Sign-In Result:", result);

                    if (result?.error) {
                        alert(result.error);
                    } else {
                        window.location.href = "/";
                    }
                } catch (error) {
                    console.error("Credentials Sign-In Error:", error);
                    alert("An unexpected error occurred. Please try again.");
                }
            }
        }),
        { name: "akshat-namkeen-account-options" }
    )
);