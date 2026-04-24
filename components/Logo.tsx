import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
    return (
        <Link href="/">
            <h2 className={cn("text-2xl font-black tracking-wider uppercase text-project_primary hover:text-project_primary-foreground hoverEffect", className)}>
                Akshat
            </h2>
        </Link>
    );
}