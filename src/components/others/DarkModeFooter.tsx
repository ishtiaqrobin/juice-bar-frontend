import Link from "next/link";
import {
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Mail,
    Phone,
    MapPin,
    ArrowRight,
    Leaf,
    Clock,
    Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer({ className = "" }) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={`bg-stone-950 text-stone-300 border-t border-stone-800 ${className}`}>
            {/* Top Section - Newsletter */}
            {/* <div className="border-b border-stone-800">
                <div className="max-w-[1200px] mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2 text-center md:text-left">
                        <h3 className="text-2xl font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-2">
                            <span className="p-2 bg-primary rounded-xl text-stone-950">
                                <Send className="h-5 w-5" />
                            </span>
                            Join the Juice Club
                        </h3>
                        <p className="text-stone-400 max-w-sm">
                            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
                        </p>
                    </div>
                    <div className="flex w-full max-w-md gap-2">
                        <Input
                            placeholder="Enter your email"
                            className="bg-stone-900 border-stone-800 focus:ring-primary focus:border-primary rounded-full px-6 h-12 text-white"
                        />
                        <Button className="rounded-full px-8 h-12 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                            Subscribe
                        </Button>
                    </div>
                </div>
            </div> */}

            {/* Main Content Sections */}
            <div className="max-w-[1200px] mx-auto px-6 py-16 grid gap-12 md:grid-cols-4">
                {/* Brand Column */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-extrabold text-white tracking-tighter flex items-center gap-2">
                            Friends <span className="text-primary">Juice Bar</span>
                        </h3>
                        <p className="text-sm leading-relaxed text-stone-400">
                            Fueling your lifestyle with premium, hand-crafted juices and nutritious snacks. Nature&apos;s best, served daily with love and freshness.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {[
                            { icon: Facebook, href: "#", color: "hover:bg-blue-500" },
                            { icon: Instagram, href: "#", color: "hover:bg-pink-500" },
                            { icon: Twitter, href: "#", color: "hover:bg-sky-500" },
                            { icon: Youtube, href: "#", color: "hover:bg-red-600" },
                        ].map((social, i) => (
                            <a
                                key={i}
                                href={social.href}
                                className={`p-2 rounded-xl bg-stone-900 border border-stone-800 transition-all duration-300 ${social.color} hover:text-white group`}
                            >
                                <social.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Explore Links */}
                <div>
                    <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <ArrowRight className="h-4 w-4 text-primary" />
                        Explore
                    </h4>
                    <ul className="space-y-4 text-sm">
                        {[
                            { label: "Our Menu", href: "/menu" },
                            { label: "Hot Promotions", href: "/promotions" },
                            { label: "Loyalty Rewards", href: "/rewards" },
                            { label: "Juice Stories", href: "/stories" },
                            { label: "Sustainability", href: "/eco" },
                        ].map((link, i) => (
                            <li key={i}>
                                <Link href={link.href} className="hover:text-primary transition-colors flex items-center group">
                                    <span className="h-px w-0 bg-primary mr-0 group-hover:w-3 group-hover:mr-2 transition-all" />
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Quick Help */}
                <div>
                    <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <ArrowRight className="h-4 w-4 text-primary" />
                        Product
                    </h4>
                    <ul className="space-y-4 text-sm">
                        {[
                            { label: "About Friends", href: "/about" },
                            { label: "Join the Team", href: "/careers" },
                            { label: "Franchise Opportunity", href: "/franchise" },
                            { label: "Customer Support", href: "/contact" },
                            { label: "Privacy Policy", href: "/privacy" },
                        ].map((link, i) => (
                            <li key={i}>
                                <Link href={link.href} className="hover:text-primary transition-colors flex items-center group">
                                    <span className="h-px w-0 bg-primary mr-0 group-hover:w-3 group-hover:mr-2 transition-all" />
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <ArrowRight className="h-4 w-4 text-primary" />
                        Get in Touch
                    </h4>
                    <div className="space-y-5">
                        <div className="flex items-start gap-4">
                            <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-primary">
                                <MapPin className="h-4 w-4" />
                            </div>
                            <p className="text-sm leading-snug pt-1">
                                123 Market Road, <br />
                                Gulshan 2, Dhaka 1212
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-primary">
                                <Phone className="h-4 w-4" />
                            </div>
                            <p className="text-sm">+880 1234-567890</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-primary">
                                <Clock className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">Open Daily</p>
                                <p className="text-xs text-stone-500">9:00 AM - 10:00 PM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-stone-900 bg-stone-950">
                <div className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-stone-500 font-medium">
                        © {currentYear} Friends <span className="text-primary font-bold">Juice Bar</span>. All rights reserved.
                        <span className="hidden md:inline mx-2">•</span>
                        Made with <Link href="#" className="text-primary hover:underline">Freshness</Link> in Dhaka.
                    </p>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-xs text-stone-500">
                            <Leaf className="h-3.5 w-3.5 text-green-500" />
                            <span>100% Organic Products</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
