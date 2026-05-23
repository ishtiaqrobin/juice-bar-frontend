import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Trophy, ArrowLeft, Star, Coins, Medal } from "lucide-react";

export default function RewardsContent() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50/50 via-background to-primary/5 border border-primary/10 p-8 shadow-sm">
            {/* Decorative Elements */}
            <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl animate-pulse" />
            <div className="absolute -bottom-16 -left-16 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

            {/* Floating Icons for background */}
            <Coins className="absolute top-10 left-10 h-6 w-6 text-indigo-200 animate-bounce delay-75" />
            <Star className="absolute bottom-10 right-20 h-5 w-5 text-indigo-300 animate-pulse" />

            <div className="max-w-xl w-full text-center space-y-8 relative z-10">
                <div className="space-y-4">
                    <div className="relative inline-block mb-4">
                        <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full animate-ping" />
                        <div className="relative p-5 rounded-3xl bg-indigo-100 text-indigo-600 shadow-inner">
                            <Trophy className="h-10 w-10" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-center gap-2 text-indigo-600 font-bold tracking-widest uppercase text-xs">
                            <Medal className="h-4 w-4" />
                            <span>Loyalty Program</span>
                            <Medal className="h-4 w-4" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
                            Rewarding Your Loyalty <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-primary">Is Almost Here!</span>
                        </h1>
                    </div>

                    <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto leading-relaxed">
                        Every sip counts! We&apos;re preparing a system where you can earn tokens
                        and redeem them for your favorite blends. Stay with us!
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link href="/">
                        <Button variant="outline" className="rounded-full px-8 h-12 border-primary/20 hover:bg-primary/5 group shadow-sm flex gap-4">
                            <ArrowLeft className="h-4 w-4 transition-transform" />
                            Back to Home
                        </Button>
                    </Link>
                    <Link href="/menu">
                        <Button className="rounded-full px-8 h-12 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all border-none">
                            Explore Menu
                        </Button>
                    </Link>
                </div>

                <div className="pt-8 flex flex-col items-center justify-center gap-3 text-indigo-600/50 font-medium text-xs">
                    <p>Members-only portal launching in several weeks</p>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className={`h-1.5 rounded-full ${i <= 3 ? "w-6 bg-indigo-500/40" : "w-1.5 bg-indigo-500/10"}`} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}