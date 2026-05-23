"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  ArrowRightCircle,
  FileText,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import AdminDashboardStats from "@/components/admin/AdminDashboardStats";
import AdminAnalyticsCharts from "@/components/admin/AdminAnalyticsCharts";
import AdminRecentActivity from "@/components/admin/AdminRecentActivity";

const AdminPage = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-black-foreground">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground">
            Real-time analytics and operations management for Friends Juice Bar.
          </p>
        </div>
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

      {/* Quick Stats Grid */}
      <AdminDashboardStats />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content Area - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          <AdminAnalyticsCharts />

          {/* Quick Navigation / Management Center */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/admin-dashboard/analytics">
              <Card className="group duration-300 hover:border-primary/30 hover:bg-red-100/20 transition-all cursor-pointer border-primary/10 border p-4 overflow-hidden h-full">
                <CardHeader className="pb-2">
                  <TrendingUp className="h-8 w-8 text-primary mb-2 group-hover:scale-100 transition-transform" />
                  <CardTitle>View Full Analytics</CardTitle>
                  <CardDescription>
                    Deep dive into your business trends and product performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm font-semibold text-primary">
                    Open Insights{" "}
                    <ArrowRightCircle className="ml-2 h-4 w-4 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin-dashboard/reports">
              <Card className="group duration-300 hover:border-blue-500/40 hover:bg-blue-100/30 transition-all cursor-pointer border-primary/10 border p-4 overflow-hidden h-full">
                <CardHeader className="pb-2">
                  <FileText className="h-8 w-8 text-blue-400 mb-2 group-hover:scale-100 transition-transform" />
                  <CardTitle>System Reports</CardTitle>
                  <CardDescription>
                    Generate and export PDF reports for users, inventory and
                    sales
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm font-semibold text-blue-400">
                    Generate Reports{" "}
                    <ArrowRightCircle className="ml-2 h-4 w-4 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Recent Activity Sidebar - Takes 1 column */}
        <div className="lg:col-span-1">
          <AdminRecentActivity />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
