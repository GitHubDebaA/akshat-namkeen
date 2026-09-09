"use client"

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { useAccountOptions } from "@/store/account/options/option";

// import child component
import SignIn from "./signin/signin";
import AccountOptions from "./options/options";
import ForgotPassword from "./forgot-password/forgot-password";
import VerifyOtp from "./verify-otp/verify-otp";
import UpdatePassword from "./update-password/update-password";

type AccountView =
    | "signin"
    | "signup"
    | "forgot-password"
    | "verify-otp"
    | "reset-password";

export default function Account() {
    const [view, setView] = useState<AccountView>("reset-password");
    const [direction, setDirection] = useState<1 | -1>(1);
    const { data: session } = useSession();
    const { isOpen, closeAccountOptions, openAccountOptions } = useAccountOptions();
    const [email, setEmail] = useState("to.debasisdas.cu@gmail.com");

    const pageVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? "100%" : "-100%",
            opacity: 1,
        }),

        center: {
            x: 0,
            opacity: 1,
        },

        exit: (direction: number) => ({
            x: direction > 0 ? "-100%" : "100%",
            opacity: 1,
        }),
    };

    const navigate = (nextView: AccountView, direction: 1 | -1 = 1) => {
        setDirection(direction);
        setView(nextView);
    };

    useEffect(() => {
        if (!isOpen) {
            // wait until drawer close animation finishes
            const timer = setTimeout(() => {
                setView("signin");
                setDirection(1);
            }, 300); // match AnimatePresence exit duration
            return () => clearTimeout(timer);
        }

    }, [isOpen]);

    const handleClose = () => {
        closeAccountOptions();
    };

    let content;
    if (session?.user) {
        content = <AccountOptions />;
    } else {
        switch (view) {
            case "signin":
                content = (
                    <SignIn onClose={handleClose} handleForgotPassword={() => navigate("forgot-password", 1)} />
                );
                break;

            case "forgot-password":
                content = (
                    <ForgotPassword onClose={handleClose} onBack={() => navigate("signin", -1)} onSendOTP={(email) => {
                        setEmail(email);
                        navigate("verify-otp", 1);
                    }} />
                );
                break;
            case "verify-otp":
                content = (
                    <VerifyOtp
                        email={email}
                        onBack={() => navigate('forgot-password', -1)}
                        onClose={handleClose}
                        onVerified={() => navigate("reset-password", 1)}
                        onSignup={() => navigate('signin', -1)}
                    />
                );
                break;
            case "reset-password":
                content = (
                    <UpdatePassword email={email} onBack={() => navigate('verify-otp', -1)} onClose={handleClose} onCompleted={() => {openAccountOptions()}}></UpdatePassword>
                );
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
                        className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-ivory z-50 flex flex-col shadow-2xl overflow-hidden"
                    >
                        <AnimatePresence
                            mode="wait"
                            initial={false}
                            custom={direction}
                        >
                            <motion.div
                                key={view}
                                custom={direction}
                                variants={pageVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    duration: 0.28,
                                    ease: "easeInOut",
                                }}
                                className="absolute inset-0 flex flex-col"
                            >
                                {content}
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </>
            )}
        </AnimatePresence >
    );
}