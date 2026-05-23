"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  Users,
  Layers,
  Image as ImageIcon,
  CheckCircle,
  Activity,
  UserPlus,
} from "lucide-react";
import { adminService } from "@/services/admin.service";
import { Skeleton } from "@/components/ui/skeleton";

const StatsCard = ({
  title,
  value,
  icon: Icon,
  description,
  loading,
  iconColor,
  iconBg,
}) => (
  <Card className="overflow-hidden transition-all shadow hover:shadow-md border-primary/10 p-4">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div
        className={`flex p-2 items-center justify-center rounded-lg ${iconBg || "bg-primary/10"}`}
      >
        <Icon className={`h-4 w-4 ${iconColor || "text-primary"}`} />
      </div>
    </CardHeader>
    <CardContent className="pt-4">
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ) : (
        <>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </>
      )}
    </CardContent>
  </Card>
);

const AdminDashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminService.getDashboardStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statItems = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      description: `${stats?.activeUsers || 0} active in last 30 days`,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      title: "New Users",
      value: stats?.recentUsers || 0,
      icon: UserPlus,
      description: "Registered in last 7 days",
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
    },
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      icon: Package,
      description: `${stats?.activeProducts || 0} currently active`,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-100",
    },
    {
      title: "Categories",
      value: stats?.totalCategories || 0,
      icon: Layers,
      description: "Total product categories",
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {loading
        ? Array(4)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="border-primary/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-primary/5">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </CardHeader>
                <CardContent className="pt-4 space-y-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))
        : statItems.map((item, index) => (
            <StatsCard key={index} {...item} loading={false} />
          ))}
    </div>
  );
};

export default AdminDashboardStats;
