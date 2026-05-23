"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Gift, Calendar, DollarSign, Award } from "lucide-react";
import { userService } from "@/services/user.service";
import { Skeleton } from "@/components/ui/skeleton";

const UserDashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await userService.getDashboardStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statItems = [
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      description: "Lifetime orders",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Reward Points",
      value: stats?.rewardPoints || 0,
      icon: Gift,
      description: "Points to redeem",
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "Total Spent",
      value: `$${(stats?.totalSpent || 0).toFixed(2)}`,
      icon: DollarSign,
      description: "Amount invested in health",
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Membership",
      value: `${stats?.membershipDays || 0} Days`,
      icon: Award,
      description: "Since you joined us",
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {loading
        ? Array(4)
            .fill(0)
            .map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))
        : statItems.map((item, index) => (
            <Card
              key={index}
              className="overflow-hidden transition-all border-primary/10 border p-4"
            >
              <CardHeader
                className={`flex flex-row items-center justify-between space-y-0 pb-2`}
              >
                <CardTitle className="text-sm font-medium">
                  {item.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${item.bg} ${item.color}`}>
                  <item.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
    </div>
  );
};

export default UserDashboardStats;
