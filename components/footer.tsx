import Link from "next/link";
import Container from "./Container";
import { FaInstagram, FaFacebook, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
    const footerLinks = [
        {
            title: 'Shop',
            links: [
                { label: 'All Namkeen', href: '/shop' },
                { label: 'Collections', href: '/collections' },
                { label: 'Best Sellers', href: '/shop/best-sellers' },
                { label: 'Combo Packs', href: '/shop/combos' },
            ],
        },
        {
            title: 'Support',
            links: [
                { label: 'Track Order', href: '/orders/track' },
                { label: 'Contact Us', href: '/contact' },
                { label: 'FAQs', href: '/faqs' },
            ],
        },
        {
            title: 'Legal',
            links: [
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
            ],
        },
    ];

    const iconStyles = "cursor-pointer w-5 h-5 text-ivory hover:text-project_primary hover:scale-120 hoverEffect transition-transform duration-100 active:scale-90";

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
                    <div className="text-sm text-center flex items-center gap-4">
                        <div className="text-ivory/80">Follow Us</div>
                        <FaFacebook className={iconStyles} />
                        <FaXTwitter className={iconStyles} />
                        <FaInstagram className={iconStyles} />
                        <FaLinkedinIn className={iconStyles} />
                        <FaWhatsapp className={iconStyles} />
                    </div>
                </div>
            </Container>
        </footer>
    );
}
