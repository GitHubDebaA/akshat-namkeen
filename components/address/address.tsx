"use client"

import { useAddressOptions } from "@/store/address/address";

import { motion, AnimatePresence } from "framer-motion";
import SavedAddress from "./saved-address/page"
import AddAddress from "./add/page";

export default function AddressOptions() {
    const { isOpen, closeAddressOptions, pageName } = useAddressOptions();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeAddressOptions}
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
                        {/* Section @@ content */}

                        {{
                            "view": <SavedAddress />,
                            "add": <AddAddress />,
                            "orders": <></>
                        }[pageName] || null}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}