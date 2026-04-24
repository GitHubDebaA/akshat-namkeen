import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";

export default function AccountOptions({ session }: { session: Session | null; }) {
    return (
        <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white border border-gray-200 shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">

            {/* Top Section */}
            <div className="p-4 border-b border-gray-200">
                {session?.user ? (
                    // ✅ Logged-in UI
                    <div className="flex items-center gap-3">
                        <Image
                            src={session.user.image || "/default-avatar.png"}
                            alt="Avatar"
                            width={40}
                            height={40}
                            className="rounded-full border"
                        />

                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-project_primary">
                                Hello, {session.user.name}
                            </span>
                            <span className="text-xs text-project_primary-foreground">
                                {session.user.email}
                            </span>
                        </div>
                    </div>
                ) : (
                    // ❌ Not logged in UI
                    <div className="space-y-3">
                        <div className="text-sm text-center text-gray-600">
                            Hello, Welcome
                        </div>

                        <Link href="/signin">
                            <Button className="w-full bg-project_primary hover:bg-project_primary-foreground">
                                Sign In
                            </Button>
                        </Link>

                        <div className="flex items-center justify-center gap-1 text-xs">
                            <span className="text-gray-500">
                                {"Don't have an account?"}
                            </span>
                            <Link
                                href="/signup"
                                className="text-project_primary hover:underline"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Menu Section */}
            <div className="py-2">
                {[
                    { label: "Your Account", href: "/profile" },
                    { label: "Your Orders", href: "/orders" },
                    { label: "Your Cart", href: "/cart" },
                ].map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="block px-4 py-2 text-xs text-project_primary hover:bg-gray-100 hover:text-project_primary-foreground transition-colors duration-150"
                    >
                        {item.label}
                    </Link>
                ))}

                {session?.user && (
                    <button onClick={() => signOut({ callbackUrl: "/" })} className="w-full text-left cursor-pointer px-4 py-2 text-xs text-project_primary hover:bg-gray-100 hover:text-project_primary-foreground transition-colors duration-150">
                        Logout
                    </button>
                )}
            </div>
        </div>
    );
}