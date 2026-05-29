import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
    icon: LucideIcon;
    label: string;
    subtitle: string;
    href: string;
    gradient: string;
    iconBg: string;
    textColor: string;
    delay?: string;
}

export default function CategoryCard({
    icon: Icon,
    label,
    subtitle,
    href,
    gradient,
    iconBg,
    textColor,
    delay = "0ms",
}: CategoryCardProps) {
    return (
        <Link href={href} className="group block">
            <div
                className={cn(
                    "relative overflow-hidden rounded-2xl p-5 cursor-pointer transition-all duration-300",
                    "hover:scale-[1.03] hover:shadow-xl active:scale-[0.98]",
                    "border border-white/30",
                    gradient
                )}
                style={{ animationDelay: delay }}
            >
                {/* Decorative blurred circle */}
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/10 blur-md pointer-events-none" />

                {/* Icon */}
                <div
                    className={cn(
                        "inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                        iconBg
                    )}
                >
                    <Icon className={cn("w-6 h-6", textColor)} strokeWidth={2} />
                </div>

                {/* Text */}
                <div>
                    <h3 className={cn("font-bold text-[15px] leading-tight", textColor)}>
                        {label}
                    </h3>
                    <p className={cn("text-xs mt-0.5 opacity-75", textColor)}>
                        {subtitle}
                    </p>
                </div>

                {/* Arrow indicator */}
                <div
                    className={cn(
                        "absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0",
                        textColor
                    )}
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                        />
                    </svg>
                </div>
            </div>
        </Link>
    );
}
