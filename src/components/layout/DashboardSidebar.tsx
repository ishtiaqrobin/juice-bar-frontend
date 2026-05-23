"use client";

import * as React from "react";
import {
    Package,
    FileText,
    ShoppingCart,
    Gift,
    BarChart3,
} from "lucide-react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { useAuth } from "@/hooks/useAuth";
import { adminRoutes } from "@/routes/adminRoutes";
import { userRoutes } from "@/routes/userRoutes";

export function DashboardSidebar() {
    const { user } = useAuth();
    const isAdmin = user?.role === "ADMIN";

    const organization = {
        name: "Friends Juice Bar",
        // type: isAdmin ? "Restaurant" : "Customer Portal",
        type: "Restaurant",
    };

    const routes = isAdmin ? adminRoutes : userRoutes;

    const quickActions = isAdmin
        ? {
            title: "Quick Actions",
            items: [
                {
                    title: "Analytics",
                    url: "/admin-dashboard/analytics",
                    icon: BarChart3,
                    tooltip: "View Analytics",
                },
                {
                    title: "Generate Report",
                    url: "/admin-dashboard/reports",
                    icon: FileText,
                    tooltip: "View Reports",
                },
            ],
        }
        : {
            title: "Quick Actions",
            items: [
                {
                    title: "New Order",
                    url: "/menu",
                    icon: ShoppingCart,
                    tooltip: "Start New Order",
                },
                {
                    title: "My Rewards",
                    url: "/rewards",
                    icon: Gift,
                    tooltip: "View Rewards",
                },
            ],
        };

    return (
        <AppSidebar
            variant="inset"
            className="border-r"
            organization={organization}
            routes={routes}
            quickActions={quickActions}
        />
    );
}
