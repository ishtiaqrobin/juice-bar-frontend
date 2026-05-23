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

export function Footer({ className = "" }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-white text-stone-600 border-t border-primary/10 ${className}`}>
      {/* Top Section - Newsletter */}
      {/* <div className="bg-stone-50/50 border-b border-primary/5">
        <div className="max-w-[1200px] mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-black text-stone-900 tracking-tight flex items-center justify-center md:justify-start gap-2">
              <span className="p-2 bg-primary/10 text-primary rounded-xl">
                <Send className="h-5 w-5" />
              </span>
              Join the Juice Club
            </h3>
            <p className="text-stone-500 max-w-sm">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
          </div>
          <div className="flex w-full max-w-md gap-2">
            <Input
              placeholder="Enter your email"
              className="bg-white border-stone-200 focus:border-primary rounded-full px-6 h-12 text-stone-900 shadow-sm"
            />
            <Button className="rounded-full px-8 h-12 font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
              Subscribe Free
            </Button>
          </div>
        </div>
      </div> */}

      {/* Main Content Sections */}
      <div className="max-w-[1200px] mx-auto px-6 py-16 grid gap-12 md:grid-cols-4">
        {/* Brand Column */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-2xl font-extrabold text-stone-900 tracking-tighter flex items-center gap-2">
              Friends <span className="text-primary">Juice Bar</span>
            </h3>
            <p className="text-sm leading-relaxed">
              Fueling your lifestyle with premium, hand-crafted juices and nutritious snacks. Nature&apos;s best, served daily with love and freshness since 2024.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {[
              { icon: Facebook, href: "#", bg: "bg-blue-50", text: "text-blue-600", hover: "hover:bg-blue-600" },
              { icon: Instagram, href: "#", bg: "bg-pink-50", text: "text-pink-600", hover: "hover:bg-pink-600" },
              { icon: Twitter, href: "#", bg: "bg-sky-50", text: "text-sky-600", hover: "hover:bg-sky-600" },
              { icon: Youtube, href: "#", bg: "bg-red-50", text: "text-red-600", hover: "hover:bg-red-600" },
            ].map((social, i) => (
              <a
                key={i}
                href={social.href}
                className={`p-2.5 rounded-2xl ${social.bg} ${social.text} border border-transparent transition-all duration-300 ${social.hover} hover:text-white group shadow-sm`}
              >
                <social.icon className="h-5 w-5 group-hover:scale-105 transition-transform" />
              </a>
            ))}
          </div>
        </div>

        {/* Explore Links */}
        <div>
          <h4 className="text-base font-bold text-stone-900 mb-6 flex items-center gap-2 uppercase tracking-wider">
            Explore
          </h4>
          <ul className="space-y-3.5 text-sm font-medium">
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

        {/* Product Column */}
        <div>
          <h4 className="text-base font-bold text-stone-900 mb-6 flex items-center gap-2 uppercase tracking-wider">
            Product
          </h4>
          <ul className="space-y-3.5 text-sm font-medium">
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
          <h4 className="text-base font-bold text-stone-900 mb-6 flex items-center gap-2 uppercase tracking-wider">
            Get in Touch
          </h4>
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/10 text-primary">
                <MapPin className="h-4 w-4" />
              </div>
              <p className="text-sm leading-snug pt-1 font-medium text-stone-700">
                123 Market Road, <br />
                Gulshan 2, Dhaka 1212
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/10 text-primary">
                <Phone className="h-4 w-4" />
              </div>
              <p className="text-sm font-medium text-stone-700">+880 1234-567890</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/10 text-primary">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-stone-900">Open Daily</p>
                <p className="text-xs text-stone-500 font-medium">9:00 AM - 10:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-100 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-500 font-semibold tracking-wide">
            © {currentYear} Friends <span className="text-primary">Juice Bar</span>. All rights reserved.
            <span className="hidden md:inline mx-2">•</span>
            Made with <span className="text-primary">Freshness</span> in Dhaka.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs text-stone-500 font-bold uppercase tracking-widest">
              <Leaf className="h-3.5 w-3.5 text-green-500" />
              <span>100% Organic Products</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
