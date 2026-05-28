import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package, ArrowLeft, Utensils, Construction } from "lucide-react";

export default function OrderContent() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center relative overflow-hidden rounded-3xl bg-linear-to-br from-indigo-50/50 via-background to-primary/5 border border-primary/10 p-8 shadow-sm">
      {/* Decorative Background Blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl -z-10" />

      <div className="max-w-xl w-full text-center space-y-8 relative z-10">
        <div className="space-y-4">
          {/* <div className="inline-flex p-4 rounded-3xl bg-primary/10 text-primary mb-4 animate-">
            <Package className="h-12 w-12" />
          </div> */}

          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-ping" />
            <div className="relative p-5 rounded-3xl bg-primary/10 text-primary shadow-inner">
              <Package className="h-10 w-10" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-primary font-bold tracking-widest uppercase text-sm">
              <Construction className="h-4 w-4" />
              <span>System Update</span>
              <Construction className="h-4 w-4" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
              Order Tracking <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-orange-500">
                is on its way!
              </span>
            </h1>
          </div>

          <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
            We&apos;re preparing something special to help you track your
            healthy goodness. Your order history and live tracking will be
            available very soon!
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
              <Utensils className="mr-2 h-4 w-4" />
              Order Now
            </Button>
          </Link>
        </div>

        <div className="pt-12 flex flex-col items-center justify-center gap-2 text-muted-foreground/40 font-medium text-sm">
          <p>Coming Soon to Friends Juice Bar</p>
          <div className="flex gap-1">
            <div className="h-1 w-8 rounded-full bg-primary/40" />
            <div className="h-1 w-2 rounded-full bg-muted-foreground/20" />
            <div className="h-1 w-2 rounded-full bg-muted-foreground/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
