"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type AccountOption = {
    isOpen: boolean;
    openAccountOptions: () => void;
    closeAccountOptions: () => void;
    toggleAccountOptions: () => void;
}

export const useAccountOptions = create<AccountOption>()(
    persist(
        (set) => ({
            isOpen: true,

            openAccountOptions: () => set({ isOpen: true }),
            closeAccountOptions: () => set({ isOpen: false }),
            toggleAccountOptions: () => set((state) => ({ isOpen: !state.isOpen })),
        }),
        { name: "akshat-namkeen-account-options" }
    )
);