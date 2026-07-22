import Link from "next/link";
import {
  Facebook,
  Instagram,
  Music2,
  ShieldCheck,
  X,
  Youtube,
} from "lucide-react";

type FooterProps = {
  className?: string;
};

type FooterColumn = {
  title: string;
  links: string[];
  verified?: boolean;
};

const footerColumns: FooterColumn[] = [
  {
    title: "Track My Order",
    links: ["Services", "Gift Vouchers", "Catering", "Party", "e-Invoice"],
  },
  {
    title: "About Us",
    links: [
      "Friends Juice Bar",
      "Our Story",
      "News",
      "Scholarship",
      "Social Responsibility",
      "Add Hope Bangladesh",
      "Join Us",
    ],
  },
  {
    title: "Our Food",
    // verified: true,
    links: [
      "Halal Policy",
      "Quality You Can Trust",
      "Nutrition Facts",
      "Allergen Information",
      "Freshness Tips",
    ],
  },
  {
    title: "Help & Support",
    links: [
      "Share Your Feedback",
      "Customer Care +880 1234-567890",
      "Find a Friends Juice Bar",
      "Scam Alert",
      "FAQ",
      "Terms & Conditions",
    ],
  },
];

const paymentMethods = [
  <span key="mastercard" aria-label="Mastercard" className="relative h-5 w-8">
    <span className="absolute left-0 top-0 h-5 w-5 rounded-full bg-[#eb001b]" />
    <span className="absolute right-0 top-0 h-5 w-5 rounded-full bg-[#f79e1b] opacity-90" />
  </span>,
  <span
    key="visa"
    className="text-[15px] font-black italic tracking-tight text-[#1a1f71]"
  >
    VISA
  </span>,
  <span
    key="boost"
    className="text-[13px] font-bold tracking-tighter text-[#ef4335]"
  >
    Boost
  </span>,
  <span
    key="grabpay"
    className="text-[11px] font-bold tracking-tighter text-[#44a844]"
  >
    GrabPay
  </span>,
  <span
    key="gopay"
    className="rounded-sm bg-[#f0ca17] px-1 py-0.5 text-[8px] font-black leading-none text-[#343434]"
  >
    GO
    <br />
    PAY
  </span>,
  <span key="shopeepay" className="text-[11px] font-bold text-[#ef5b35]">
    S<span className="text-[8px]">Pay</span>
  </span>,
  <span
    key="touchngo"
    className="rounded bg-[#1676b8] px-0.5 text-[8px] font-bold leading-4 text-white"
  >
    TnG
  </span>,
];

const footerHref = (label: string) =>
  `/${label
    .toLowerCase()
    .replaceAll("&", "and")
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;

export function Footer({ className = "" }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-white font-sans text-black ${className}`}>
      <div className="mx-auto max-w-[1024px] px-10 pt-[104px]">
        <div className="grid grid-cols-4 gap-x-16">
          {footerColumns.map((column) => (
            <section key={column.title}>
              <h2 className="mb-4 flex items-center gap-3 text-base font-bold leading-5">
                {column.title}
                {column.verified && (
                  <ShieldCheck
                    aria-label="Verified halal"
                    className="h-7 w-7 stroke-[1.4]"
                  />
                )}
              </h2>
              <ul className="space-y-[13px] text-base leading-6">
                {column.links.map((link) => (
                  <li key={link}>
                    <Link
                      href={footerHref(link)}
                      className="transition-opacity hover:opacity-60"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-[108px] flex justify-center gap-8">
          <Link
            href="#"
            aria-label="TikTok"
            className="transition-opacity hover:opacity-60"
          >
            <Music2 className="h-6 w-6" />
          </Link>
          <Link
            href="#"
            aria-label="Instagram"
            className="transition-opacity hover:opacity-60"
          >
            <Instagram className="h-6 w-6 stroke-[2.4]" />
          </Link>
          <Link
            href="#"
            aria-label="Facebook"
            className="transition-opacity hover:opacity-60"
          >
            <Facebook className="h-6 w-6" />
          </Link>
          <Link
            href="#"
            aria-label="X"
            className="transition-opacity hover:opacity-60"
          >
            <X className="h-7 w-7 stroke-[1.8]" />
          </Link>
          <Link
            href="#"
            aria-label="YouTube"
            className="transition-opacity hover:opacity-60"
          >
            <Youtube className="h-7 w-7" />
          </Link>
        </div>

        <div className="mt-10 flex items-center justify-center gap-5">
          <span className="text-sm">Secure Payment</span>
          <div
            className="flex items-center gap-3"
            aria-label="Accepted payment methods"
          >
            {paymentMethods}
          </div>
        </div>

        <div className="flex justify-center gap-5 py-7 text-sm leading-6">
          <Link href="/terms-of-use" className="hover:underline">
            Terms of Use
          </Link>
          <span aria-hidden="true">|</span>
          <Link href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
          <span aria-hidden="true">|</span>
          <Link href="/cookie-policy" className="hover:underline">
            Use of Cookies
          </Link>
          <span aria-hidden="true">|</span>
          <span>
            © Copyright {currentYear} Friends Juice Bar. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
