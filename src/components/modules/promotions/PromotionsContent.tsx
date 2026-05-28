import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Percent, ArrowLeft, Ticket, Flame } from "lucide-react";

export default function PromotionsContent() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-50/50 via-background to-primary/5 border border-primary/10 p-8">
      {/* Decorative Elements */}
      <div className="absolute top-[-10%] right-[-5%] h-64 w-64 rounded-full bg-orange-500/10 blur-3xl animate-pulse" />
      <div className="absolute bottom-[-20%] left-[-5%] h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

      <div className="max-w-xl w-full text-center space-y-8 relative z-10 transition-all duration-700">
        <div className="space-y-4">
          {/* <div className="inline-flex p-4 rounded-3xl bg-orange-100 text-orange-600 mb-4 animate-bounce">
            <Percent className="h-10 w-10" />
          </div> */}

          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full animate-ping" />
            <div className="relative p-5 rounded-3xl bg-orange-100 text-orange-600 shadow-inner">
              <Percent className="h-10 w-10" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-orange-600 font-bold tracking-widest uppercase text-xs">
              <Flame className="h-4 w-4" />
              <span>Trending Deals</span>
              <Flame className="h-4 w-4" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
              Sizzling Offers <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-primary">
                Under Construction!
              </span>
            </h1>
          </div>

          <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto leading-relaxed">
            We&apos;re currently brewing some exclusive discounts and tropical
            deals just for you. Get ready for a taste of savings!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/">
            <Button
              variant="outline"
              className="rounded-full px-8 h-12 border-primary/20 hover:bg-primary/5 group flex gap-4"
            >
              <ArrowLeft className="h-4 w-4 transition-transform" />
              Back to Home
            </Button>
          </Link>
          <Link href="/menu">
            <Button className="rounded-full px-8 h-12 bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 border-none transition-all">
              View Today&apos;s Menu
            </Button>
          </Link>
        </div>

        <div className="pt-8 flex flex-wrap items-center justify-center gap-4 text-orange-600/60 font-medium text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-100">
            <Ticket className="h-3 w-3" />
            <span>Voucher System: 80% Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
}
