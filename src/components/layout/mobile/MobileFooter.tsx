import React from "react";
import Link from "next/link";
import {
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    MapPin,
    Phone,
    Send
} from "lucide-react";

const MobileFooter = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-primary/10 px-6 py-10 md:hidden">
            <div className="flex flex-col items-center text-center space-y-8">

                {/* Brand */}
                <div className="space-y-2">
                    <h3 className="text-xl font-black text-stone-900 tracking-tighter">
                        Friends <span className="text-primary">Juice Bar</span>
                    </h3>
                    <p className="text-xs text-stone-500 font-medium">
                        Nature&apos;s best, served daily with love.
                    </p>
                </div>

                {/* Quick Contact */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-center gap-2 text-xs font-semibold text-stone-700">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        <span>Gulshan 2, Dhaka</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs font-semibold text-stone-700">
                        <Phone className="h-3.5 w-3.5 text-primary" />
                        <span>+880 1234-567890</span>
                    </div>
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-4">
                    {[
                        { icon: Facebook, href: "#", bg: "bg-blue-50", text: "text-blue-600" },
                        { icon: Instagram, href: "#", bg: "bg-pink-50", text: "text-pink-600" },
                        { icon: Twitter, href: "#", bg: "bg-sky-50", text: "text-sky-600" },
                        { icon: Youtube, href: "#", bg: "bg-red-50", text: "text-red-600" },
                    ].map((social, i) => (
                        <a
                            key={i}
                            href={social.href}
                            className={`p-3 rounded-2xl ${social.bg} ${social.text} border border-transparent active:scale-95 transition-all shadow-sm`}
                        >
                            <social.icon className="h-5 w-5" />
                        </a>
                    ))}
                </div>

                {/* Essential Links */}
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                    <Link href="/menu" className="hover:text-primary transition-colors">Menu</Link>
                    <Link href="/promotions" className="hover:text-primary transition-colors">Deals</Link>
                    <Link href="/rewards" className="hover:text-primary transition-colors">Rewards</Link>
                    <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
                    <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
                </div>

                {/* Bottom Bar */}
                <div className="pt-4 border-t border-stone-100 w-full">
                    <p className="text-[10px] text-stone-400 font-medium tracking-wide">
                        © {currentYear} Friends <span className="text-primary font-bold">Juice Bar</span>. <br />
                        Freshly Made in Dhaka
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default MobileFooter;
