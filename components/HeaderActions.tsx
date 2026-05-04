"use client";

import Link from "next/link";
import Container from "./Container";
import AccountOptions from "./AccountOptions";
import { Search, ShoppingBag, Bell, User } from "lucide-react";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react"

import { useCart } from "@/store/cart";
import { useAccountOptions } from "@/store/account/options/option";

export default function HeaderActions() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { data: session } = useSession();
    
    const { openCart } = useCart();
    const { openAccountOptions } = useAccountOptions();

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

    const HandleOpenCart = () => {
        openCart();
    }

    return (
        <Container className="flex items-center justify-end gap-6 w-full">
            <div className="relative group">
                <Link href="/search" className="transition-transform duration-100 active:scale-90">
                    <Search className="w-5 h-5 text-project_primary hover:text-project_primary-foreground hover:scale-110 hoverEffect transition-transform duration-100 active:scale-90" />
                </Link>
                <span className="whitespace-nowrap absolute -bottom-8 left-1/2 -translate-x-1/2 translate-y-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 text-xs px-2 py-1 rounded-md bg-black text-white">
                    Search
                </span>
            </div>

            <div className="relative group">
                <div className="cursor-pointer transition-transform duration-100 relative" onClick={HandleOpenCart}>
                    <ShoppingBag className="w-5 h-5 text-project_primary hover:text-project_primary-foreground hover:scale-110 hoverEffect transition-transform duration-100 active:scale-90" />
                </div>
                <span className="whitespace-nowrap absolute -bottom-8 left-1/2 -translate-x-1/2 translate-y-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 text-xs px-2 py-1 rounded-md bg-black text-white">
                    Cart
                </span>
            </div>
            <div className="relative group">
                <Link href="/notifications" className="transition-transform duration-100">
                    <Bell className="w-5 h-5 text-project_primary hover:text-project_primary-foreground hover:scale-110 hoverEffect transition-transform duration-100 active:scale-90" />
                </Link>
                <span className="whitespace-nowrap absolute -bottom-8 left-1/2 -translate-x-1/2 translate-y-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 text-xs px-2 py-1 rounded-md bg-black text-white">
                    Notifications
                </span>
            </div>
            <div className="relative group">
                <div className="cursor-pointer transition-transform duration-100 relative" onClick={openAccountOptions}>
                    <User className="w-5 h-5 text-project_primary hover:text-project_primary-foreground hover:scale-110 hoverEffect transition-transform duration-100 active:scale-90" />
                </div>
                <span className="whitespace-nowrap absolute -bottom-8 left-1/2 -translate-x-1/2 translate-y-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 text-xs px-2 py-1 rounded-md bg-black text-white">
                    Your Account
                </span>
            </div>
        </Container>
    );
}