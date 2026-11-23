"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Container from "./Container";
import Logo from "./Logo";
import HeaderActions from "./HeaderActions";

export default function Header() {
    const [hidden, setHidden] = useState(false);
    const lastScrollY = useRef(0);
    const reduceMotion = useReducedMotion();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setHidden(currentScrollY > 96 && currentScrollY > lastScrollY.current);
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.header
            animate={{ y: hidden ? "-100%" : "0%" }}
            transition={{ duration: reduceMotion ? 0 : 0.24, ease: "easeOut" }}
            className="sticky top-0 z-50 bg-white py-4 shadow-sm"
        >
            <Container className="flex items-center justify-between">
                <Logo/>
                <HeaderActions />
            </Container>
        </motion.header>
    );
}
