"use client"

import { create } from "zustand";

type AddressOption = {
    isOpen: boolean;
    pageName: string;
    setPageName: (name: string) => void;
    openAddressOptions: () => void;
    closeAddressOptions: () => void;
    toggleAddressOptions: () => void;
}

export const useAddressOptions = create<AddressOption>()(
    (set) => ({
        isOpen: false,
        pageName: 'view',
        setPageName: (name) => {
            set({pageName: name})
        },
        openAddressOptions: () => {
            set({ 
                isOpen: true,
                pageName: 'view'
            })
        },
        closeAddressOptions: () => set({ isOpen: false }),
        toggleAddressOptions: () => set((state) => ({ isOpen: !state.isOpen })),
    })
);