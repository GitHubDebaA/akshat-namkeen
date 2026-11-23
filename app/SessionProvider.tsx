"use client"

import { SessionProvider } from "next-auth/react";
import type { ComponentType, ReactNode } from "react";

const CompatibleSessionProvider = SessionProvider as unknown as ComponentType<{
    children?: ReactNode;
}>;

export default function Provider({ children }: { children: ReactNode }) {
    return <CompatibleSessionProvider>{children}</CompatibleSessionProvider>;
}
