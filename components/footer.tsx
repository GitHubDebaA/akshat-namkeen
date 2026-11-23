import Link from "next/link";
import Container from "./Container";

export default function Footer() {
    const supportEmail = process.env.SUPPORT_EMAIL;
    const supportPhone = process.env.SUPPORT_PHONE;
    const footerLinks = [
        {
            title: 'Shop',
            links: [
                { label: 'All Namkeen', href: '/product' },
                { label: 'Collections', href: '/collections' },
            ],
        },
        {
            title: 'Your account',
            links: [
                { label: 'My Orders', href: '/orders' },
                { label: 'Wishlist', href: '/wishlist' },
            ],
        },
        ...(supportEmail || supportPhone ? [{
            title: 'Support',
            links: [
                ...(supportEmail ? [{ label: supportEmail, href: `mailto:${supportEmail}` }] : []),
                ...(supportPhone ? [{ label: supportPhone, href: `tel:${supportPhone.replace(/[^+\d]/g, "")}` }] : []),
            ],
        }] : []),
    ];

    return (
        <footer className="w-full bg-obsidian">
            <Container className="text-ivory flex flex-col pt-10 pb-6 gap-8">
                {/* Top Section: Quick Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-ivory/10 pb-8">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-1">
                        <h3 className="font-bold text-lg mb-3 text-project_primary">Akshat Namkeen</h3>
                        <p className="text-sm text-ivory/70 leading-relaxed max-w-xs">
                            Fresh, crunchy, and authentic Indian namkeen delivered straight to your doorstep.
                        </p>
                    </div>

                    {/* Links Columns */}
                    {footerLinks.map((group) => (
                        <div key={group.title} className="flex flex-col">
                            <h4 className="font-semibold text-sm tracking-wider uppercase mb-3 text-ivory/90">{group.title}</h4>
                            <ul className="space-y-2">
                                {group.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-ivory/60 hover:text-project_primary transition-colors duration-150 block py-0.5"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Section: Copyright & Socials */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full pt-2">
                    <div className="text-sm text-center md:text-left text-ivory/70">
                        &copy; {new Date().getFullYear()} Akshat Namkeen. All rights reserved.
                    </div>
                </div>
            </Container>
        </footer>
    );
}
