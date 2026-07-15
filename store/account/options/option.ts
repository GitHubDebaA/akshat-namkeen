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
                const result = await signIn("credentials", {
                    email,
                    password,
                    redirect: false,
                });

                return result;
            }
        }),
        { name: "akshat-namkeen-account-options" }
    )
);