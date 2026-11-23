"use client"

import { create } from "zustand";

type AddressOption = {
    isOpen: boolean;
    pageName: string;
    addressRevision: number;
    setPageName: (name: string) => void;
    notifyAddressChange: () => void;
    openAddressOptions: () => void;
    closeAddressOptions: () => void;
    toggleAddressOptions: () => void;
}

export const useAddressOptions = create<AddressOption>()(
    (set) => ({
        isOpen: false,
        pageName: 'view',
        addressRevision: 0,
        setPageName: (name) => {
            set({pageName: name})
        },
        notifyAddressChange: () => set((state) => ({ addressRevision: state.addressRevision + 1 })),
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
