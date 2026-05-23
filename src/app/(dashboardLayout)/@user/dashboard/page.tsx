"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ShoppingCart, Gift, Star, ArrowRight, Utensils, Settings } from "lucide-react";
import UserDashboardStats from "@/components/dashboard/UserDashboardStats";
import { useAuth } from "@/hooks/useAuth";

const DashboardPage = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-primary/5 p-8 border border-primary/10">
                <div className="relative z-10">
                    <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl text-foreground">
                        Welcome Back, <span className="text-primary">{user?.name?.split(' ')[0] || 'Friend'}!</span> ✨
                    </h1>
                    <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
                        Fuel your body with nature&apos;s best. Ready for your daily dose of vitamins?
                    </p>
                    <div className="mt-6 flex flex-wrap gap-4">
                        <Link href="/menu">
                            <Button className="rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                                <Utensils className="mr-2 h-4 w-4" />
                                Order Something Fresh
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-[-10%] right-[-5%] h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute bottom-[-20%] left-[10%] h-48 w-48 rounded-full bg-orange-500/10 blur-3xl" />
            </div>

            {/* Dynamic Stats Grid */}
            <UserDashboardStats />

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-primary/10 border p-4 shadow-sm hover:shadow-md transition-shadow ">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl">Quick Actions</CardTitle>
                            <CardDescription>
                                Common tasks to manage your experience
                            </CardDescription>
                        </div>
                        <Settings className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>

                    {/* Quick Actions Stats */}
                    <CardContent className="grid grid-cols-1 gap-3 pt-4">
                        <Link href="/rewards">
                            <Button
                                variant="outline"
                                className="w-full justify-between h-14 rounded-2xl border-amber-100 bg-amber-50/30 hover:bg-amber-50 hover:border-amber-200 transition-all group"
                            >
                                <div className="flex items-center">
                                    <div className="p-2 mr-3 rounded-xl bg-amber-100 text-amber-600 group-hover:scale-110 transition-transform">
                                        <Gift className="h-5 w-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-sm text-amber-900">My Rewards</p>
                                        <p className="text-[10px] text-amber-700/70">Check your points</p>
                                    </div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-amber-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                            </Button>
                        </Link>
                        <Link href="/dashboard/settings">
                            <Button
                                variant="outline"
                                className="w-full justify-between h-14 rounded-2xl border-indigo-100 bg-indigo-50/30 hover:bg-indigo-50 hover:border-indigo-200 transition-all group"
                            >
                                <div className="flex items-center">
                                    <div className="p-2 mr-3 rounded-xl bg-indigo-100 text-indigo-600 group-hover:scale-110 transition-transform">
                                        <Star className="h-5 w-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-sm text-indigo-900">Profile Settings</p>
                                        <p className="text-[10px] text-indigo-700/70">Update your account</p>
                                    </div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-indigo-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                            </Button>
                        </Link>
                        <Link href="/orders">
                            <Button
                                variant="outline"
                                className="w-full justify-between h-14 rounded-2xl border-emerald-100 bg-emerald-50/30 hover:bg-emerald-50 hover:border-emerald-200 transition-all group"
                            >
                                <div className="flex items-center">
                                    <div className="p-2 mr-3 rounded-xl bg-emerald-100 text-emerald-600 group-hover:scale-110 transition-transform">
                                        <ShoppingCart className="h-5 w-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-sm text-emerald-900">Order History</p>
                                        <p className="text-[10px] text-emerald-700/70">View past orders</p>
                                    </div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="border-primary/10 border p-4 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <div>
                            <CardTitle className="text-xl">Recent Orders</CardTitle>
                            <CardDescription>Your latest taste of Friends Juice Bar</CardDescription>
                        </div>
                        <Link href="/orders" className="text-sm text-primary hover:underline flex items-center">
                            View all <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-5">
                            <div className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">M</div>
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-semibold group-hover:text-primary transition-colors">Mango Smoothie</p>
                                        <p className="text-xs text-muted-foreground flex items-center">
                                            <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5" />
                                            Delivered • 2 days ago
                                        </p>
                                    </div>
                                </div>
                                <div className="text-sm font-bold bg-primary/5 px-2 py-1 rounded-md text-primary">$8.99</div>
                            </div>
                            <div className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">A</div>
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-semibold group-hover:text-primary transition-colors">Acai Bowl</p>
                                        <p className="text-xs text-muted-foreground flex items-center">
                                            <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5" />
                                            Delivered • 1 week ago
                                        </p>
                                    </div>
                                </div>
                                <div className="text-sm font-bold bg-primary/5 px-2 py-1 rounded-md text-primary">$12.99</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;
