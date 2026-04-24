import React from "react";
import Container from "./Container";
import { FaInstagram, FaFacebook, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
    return (
        <footer className="w-full bg-gray-200 mt-8">
            <Container className="text-project_primary-foreground flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="mx-auto py-4 text-sm text-center">
                    &copy; {new Date().getFullYear()} Akshat Namkeen. All rights reserved.
                </div>
                <div className="mx-auto py-4 text-sm text-center flex items-center gap-4">
                    <div>Follow Us</div>
                    <FaFacebook className="cursor-pointer w-5 h-5 text-project_primary hover:text-project_primary-foreground hover:scale-120 hoverEffect transition-transform duration-100 active:scale-90" /> 
                    <FaXTwitter className="cursor-pointer w-5 h-5 text-project_primary hover:text-project_primary-foreground hover:scale-120 hoverEffect transition-transform duration-100 active:scale-90" />
                    <FaInstagram className="cursor-pointer w-5 h-5 text-project_primary hover:text-project_primary-foreground hover:scale-120 hoverEffect transition-transform duration-100 active:scale-90" />
                    <FaLinkedinIn className="cursor-pointer w-5 h-5 text-project_primary hover:text-project_primary-foreground hover:scale-120 hoverEffect transition-transform duration-100 active:scale-90" />
                    <FaWhatsapp className="cursor-pointer w-5 h-5 text-project_primary hover:text-project_primary-foreground hover:scale-120 hoverEffect transition-transform duration-100 active:scale-90" />
                </div>
            </Container>
        </footer>
    );
}