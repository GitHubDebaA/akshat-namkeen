"use client";

import Link from "next/link";
import Container from "./Container";
import AccountOptions from "./AccountOptions";
import { Search, ShoppingBag, Bell, User } from "lucide-react";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react"

export default function HeaderActions() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { data: session } = useSession()

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    }

    return (
        <Container className="flex items-center justify-end gap-6 w-full">
            <Link href="/search" className="transition-transform duration-100 active:scale-90">
                <Search className="w-5 h-5 text-project_primary hover:text-project_primary-foreground hover:scale-120 hoverEffect transition-transform duration-100 active:scale-90" />
            </Link>
            <Link href="/cart" className="transition-transform duration-100 active:scale-90">
                <ShoppingBag className="w-5 h-5 text-project_primary hover:text-project_primary-foreground hover:scale-120 hoverEffect transition-transform duration-100 active:scale-90" />
            </Link>
            <Link href="/notifications" className="transition-transform duration-100">
                <Bell className="w-5 h-5 text-project_primary hover:text-project_primary-foreground hover:scale-120 hoverEffect transition-transform duration-100 active:scale-90" />
            </Link>
            <div ref={menuRef} className="relative">
                <div className="cursor-pointer transition-transform duration-100 relative" onClick={toggleMenu}>
                    <User className="w-5 h-5 text-project_primary hover:text-project_primary-foreground hover:scale-120 hoverEffect transition-transform duration-100 active:scale-90" />
                    {isMenuOpen && <AccountOptions session={session} />}
                </div>
            </div>
        </Container>
    );
}