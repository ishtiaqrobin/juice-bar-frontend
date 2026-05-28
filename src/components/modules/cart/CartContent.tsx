import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft, Timer, Sparkles } from "lucide-react";

export default function CartContent() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center relative overflow-hidden rounded-3xl bg-linear-to-br from-orange-50/50 via-background to-primary/5 border border-primary/10 p-8 shadow-sm">
      {/* Decorative Background Blobs */}
      <div className="absolute top-[-10%] right-[-5%]  w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-20%] left-[-5%] w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />

      <div className="max-w-xl w-full text-center space-y-8 relative z-10">
        <div className="space-y-4">
          {/* <div className="inline-flex p-4 rounded-3xl bg-primary/10 text-primary mb-4 animate-bounce">
          <ShoppingCart className="h-12 w-12" />
        </div> */}

          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-ping" />
            <div className="relative p-5 rounded-3xl bg-primary/10 text-primary shadow-inner">
              <ShoppingCart className="h-10 w-10" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-primary font-bold tracking-widest uppercase text-sm">
              <Sparkles className="h-4 w-4" />
              <span>Coming Soon</span>
              <Sparkles className="h-4 w-4" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
              Our Cart is <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-orange-500">
                Getting Juicier!
              </span>
            </h1>
          </div>

          <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
            We&apos;re currently blending the perfect checkout experience for
            you. Soon you&apos;ll be able to grab your favorite juices with just
            a few clicks!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Link href="/">
            <Button
              variant="outline"
              className="rounded-full px-8 h-12 border-primary/20 hover:bg-primary/5 transition-all group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Button>
          </Link>
          <Link href="/menu">
            <Button className="rounded-full px-8 h-12 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
              Explore Our Menu
            </Button>
          </Link>
        </div>

        <div className="pt-12 flex items-center justify-center gap-6 text-muted-foreground/40 font-medium text-sm">
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            <span>Launching Soon</span>
          </div>
          <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
          <span>2024 Release</span>
        </div>
      </div>
    </div>
  );
}
