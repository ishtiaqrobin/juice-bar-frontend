import Link from "next/link";
import {
  Leaf,
  Droplets,
  Citrus,
  IceCream2,
  Gift,
  ArrowRight,
  Clock,
  ShieldCheck,
  Truck,
  FlameKindling,
  Star,
  ChevronRight,
} from "lucide-react";
import { HeroCarousel } from "@/components/layout/home/HeroCarousel";
import CategoryCard from "@/components/layout/home/CategoryCard";
import ProductHighlightCard from "@/components/layout/home/ProductHighlightCard";
import { getMenuProducts } from "@/actions/product.action";
import { Product } from "@/types/product.type";

// ─── Fallback mock products (shown if API returns empty or fails) ────────────
const MOCK_PRODUCTS: Product[] = [
  {
    id: "mock-1",
    name: "Watermelon Cooler",
    price: 160,
    discountPrice: 120,
    discountPercentage: 25,
    featured: "Best Seller",
    stock: 15,
    description: "Fresh watermelon blended with mint & lime",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "mock-2",
    name: "Mango Twist",
    price: 190,
    discountPrice: null,
    discountPercentage: null,
    featured: "New",
    stock: 10,
    description: "Ripe alphonso mangoes with a hint of ginger",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "mock-3",
    name: "Green Detox",
    price: 220,
    discountPrice: 180,
    discountPercentage: 18,
    featured: "Popular",
    stock: 8,
    description: "Spinach, cucumber, celery & lemon cold-pressed",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "mock-4",
    name: "Berry Bliss",
    price: 200,
    discountPrice: null,
    discountPercentage: null,
    featured: "Trending",
    stock: 5,
    description: "Strawberry, blueberry & raspberry smoothie",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "mock-5",
    name: "Orange Burst",
    price: 150,
    discountPrice: null,
    discountPercentage: null,
    featured: null,
    stock: 20,
    description: "Freshly squeezed Valencia oranges",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "mock-6",
    name: "Pineapple Zest",
    price: 180,
    discountPrice: 140,
    discountPercentage: 22,
    featured: "Best Seller",
    stock: 12,
    description: "Tropical pineapple with coconut water & turmeric",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "mock-7",
    name: "Dragon Fruit Special",
    price: 250,
    discountPrice: null,
    discountPercentage: null,
    featured: "Premium",
    stock: 3,
    description: "Exotic dragon fruit blended with coconut milk",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "mock-8",
    name: "Classic Lemonade",
    price: 120,
    discountPrice: null,
    discountPercentage: null,
    featured: null,
    stock: 0,
    description: "Old-fashioned lemonade with a pinch of salt",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// ─── Category explorer data ────────────────────────────────────────────────────
const CATEGORIES = [
  {
    icon: Leaf,
    label: "Detox & Green",
    subtitle: "Cold-pressed greens",
    href: "/menu",
    gradient: "bg-gradient-to-br from-emerald-400 to-green-600",
    iconBg: "bg-white/25",
    textColor: "text-white",
    delay: "0ms",
  },
  {
    icon: Citrus,
    label: "Fresh Juices",
    subtitle: "Squeezed to order",
    href: "/menu",
    gradient: "bg-gradient-to-br from-orange-400 to-amber-500",
    iconBg: "bg-white/25",
    textColor: "text-white",
    delay: "60ms",
  },
  {
    icon: Droplets,
    label: "Smoothies",
    subtitle: "Thick & creamy blends",
    href: "/menu",
    gradient: "bg-gradient-to-br from-violet-500 to-purple-600",
    iconBg: "bg-white/25",
    textColor: "text-white",
    delay: "120ms",
  },
  {
    icon: IceCream2,
    label: "Iced Specials",
    subtitle: "Chilled & refreshing",
    href: "/menu",
    gradient: "bg-gradient-to-br from-sky-400 to-blue-500",
    iconBg: "bg-white/25",
    textColor: "text-white",
    delay: "180ms",
  },
];

// ─── Why choose us data ────────────────────────────────────────────────────────
const WHY_CARDS = [
  {
    icon: ShieldCheck,
    title: "100% Natural",
    desc: "No artificial colours, preservatives, or sweeteners — ever.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    icon: FlameKindling,
    title: "Cold-Pressed",
    desc: "Nutrients locked in at low temperature for maximum health benefits.",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-100",
  },
  {
    icon: Truck,
    title: "Fresh Every Day",
    desc: "Prepared fresh daily with locally sourced, seasonal fruits.",
    color: "text-sky-600",
    bg: "bg-sky-50",
    border: "border-sky-100",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export const metadata = {
  title: "Friends Juice Bar | Fresh Cold-Pressed Juices in Bangladesh",
  description:
    "Discover Bangladesh's finest cold-pressed juices, smoothies, and detox drinks at Friends Juice Bar. 100% natural, no artificial additives. Order online for delivery or self-collect.",
  keywords: [
    "juice bar bangladesh",
    "cold pressed juice",
    "fresh smoothies",
    "healthy drinks",
    "friends juice bar",
    "detox juice",
  ],
  openGraph: {
    title: "Friends Juice Bar | Fresh Cold-Pressed Juices",
    description:
      "100% natural cold-pressed juices and smoothies. Order online!",
    type: "website",
  },
};

export default async function HomePage() {
  return (
    <div className="flex flex-col bg-white">
      {/* ── Hero Carousel ─────────────────────────────────────────── */}
      <section className="relative isolate bg-white">
        <div className="mx-auto max-w-[972px] px-4 pt-4 md:py-16">
          <HeroCarousel />
        </div>
      </section>

      {/* ── Category Explorer ─────────────────────────────────────── */}
      {/* <section className="mx-auto max-w-[972px] w-full px-4 pt-8 pb-2 md:pt-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[17px] md:text-xl font-bold text-gray-900 leading-tight">
              Explore Our Menu
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Freshly crafted, every single day
            </p>
          </div>
          <Link
            href="/menu"
            className="flex items-center gap-1 text-red-600 text-xs font-semibold hover:underline"
          >
            View All <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.label} {...cat} />
          ))}
        </div>
      </section> */}

      {/* ── Signature Best-Sellers ────────────────────────────────── */}
      {/* <section className="mx-auto max-w-[972px] w-full px-4 pt-8 pb-2 md:pt-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[17px] md:text-xl font-bold text-gray-900 leading-tight">
              Signature Best-Sellers
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Loved by hundreds of customers
            </p>
          </div>
          <Link
            href="/menu"
            className="flex items-center gap-1 text-red-600 text-xs font-semibold hover:underline"
          >
            See All <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {products.map((product) => (
            <ProductHighlightCard key={product.id} {...product} />
          ))}
        </div>
      </section> */}

      {/* ── Loyalty & Rewards Banner ──────────────────────────────── */}
      {/* <section className="mx-auto max-w-[972px] w-full px-4 pt-8 pb-2 md:pt-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-6 md:p-8">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="shrink-0 bg-white/20 backdrop-blur-sm rounded-2xl p-3.5">
                <Gift className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-white font-bold text-base md:text-lg leading-tight">
                    Friends Club — Loyalty Rewards
                  </h2>
                  <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                    FREE
                  </span>
                </div>
                <p className="text-white/80 text-sm leading-relaxed max-w-lg">
                  Earn points with every purchase and unlock exclusive perks —
                  free drinks, early access to new flavours, and members-only
                  discounts.
                </p>
                <div className="flex items-center gap-5 mt-3">
                  {[
                    { label: "Points per ৳10", value: "1" },
                    { label: "Free Drink at", value: "500 pts" },
                    { label: "Active Members", value: "2.4k+" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p className="text-white font-bold text-sm">
                        {stat.value}
                      </p>
                      <p className="text-white/60 text-[10px]">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/rewards"
              className="shrink-0 flex items-center gap-2 bg-white text-purple-700 font-bold text-sm px-6 py-3 rounded-full shadow-xl hover:shadow-white/20 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Join Club
              <Star className="w-4 h-4 fill-purple-700" />
            </Link>
          </div>
        </div>
      </section> */}

      {/* ── Why Friends Juice Bar ─────────────────────────────────── */}
      {/* <section className="mx-auto max-w-[972px] w-full px-4 pt-8 pb-10 md:pt-10 md:pb-14">
        <div className="mb-5 text-center">
          <h2 className="text-[17px] md:text-xl font-bold text-gray-900">
            Why Friends Juice Bar?
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            We craft drinks that are as good for your body as they taste
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {WHY_CARDS.map((card) => (
            <div
              key={card.title}
              className={`flex flex-col items-center text-center p-5 rounded-2xl border ${card.bg} ${card.border} hover:shadow-md transition-shadow duration-300`}
            >
              <div
                className={`p-3 rounded-xl ${card.bg} mb-3 border ${card.border}`}
              >
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <h3 className={`text-sm font-bold ${card.color} mb-1`}>
                {card.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section> */}
    </div>
  );
}
