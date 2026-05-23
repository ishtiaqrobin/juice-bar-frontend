"use client";

import AdminAnalyticsCharts from "@/components/admin/AdminAnalyticsCharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { BarChart3, TrendingUp, Calendar, RefreshCw, UserCheck, Zap, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AnalyticsPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Advanced Analytics
                    </h1>
                    <p className="text-muted-foreground">
                        In-depth visualization of business performance and user growth.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2 border-primary/20">
                        <Calendar className="h-4 w-4" />
                        Last 30 Days
                    </Button>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.location.reload()}
                            className="bg-background hover:bg-primary/5 border-primary/20"
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Refresh
                        </Button>
                    </div>
                </div>
            </div>

            {/* Analytics Stats */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="shadow hover:shadow-md border-primary/10 p-4">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Retention Rate</CardTitle>
                        <div
                            className={`flex p-2 items-center justify-center rounded-full bg-indigo-100`}
                        >
                            <UserCheck className={`h-4 w-4 text-indigo-600`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">84.2%</div>
                        <div className="flex items-center gap-1 text-xs text-indigo-600 mt-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>+2.4% from last month</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow hover:shadow-md border-primary/10 p-4">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Conversion</CardTitle>
                        <div
                            className={`flex p-2 items-center justify-center rounded-full bg-emerald-100`}
                        >
                            <Zap className={`h-4 w-4 text-emerald-600`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">12.5%</div>
                        <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>+1.1% from last month</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow hover:shadow-md border-primary/10 p-4">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Avg Order Value</CardTitle>
                        <div
                            className={`flex p-2 items-center justify-center rounded-full bg-amber-100`}
                        >
                            <CreditCard className={`h-4 w-4 text-amber-600`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">$18.90</div>
                        <div className="flex items-center gap-1 text-xs text-orange-600 mt-1">
                            <BarChart3 className="h-3 w-3" />
                            <span>Stable for 2 months</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <AdminAnalyticsCharts />

            <Card className="border-primary/10 border p-4">
                <CardHeader className="pb-4">
                    <CardTitle>Forecast Analysis</CardTitle>
                    <CardDescription>Predicted trends based on historical seasonal data</CardDescription>
                </CardHeader>
                <CardContent className="min-h-[200px] flex items-center justify-center bg-primary/5 rounded-xl border-primary/5 italic text-muted-foreground">
                    Predictive modeling data will be available after more sales cycles are recorded.
                </CardContent>
            </Card>
        </div>
    );
}