import React from "react";
import Container from "./Container";
import Logo from "./Logo";
import HeaderActions from "./HeaderActions";

export default function Header() {
    return (
        <header className="bg-white py-4 sticky top-0 z-50 shadow-sm">
            <Container className="flex items-center justify-between">
                <Logo/>
                <HeaderActions />
            </Container>
        </header>
    );
}