"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  ChevronDown,
  Home,
  ShoppingCart,
  Gift,
  LogOut,
  User,
  CreditCard,
  History,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// Navigation items for dashboard
const dashboardNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Orders",
    url: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "Rewards",
    url: "/dashboard/rewards",
    icon: Gift,
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Payment",
    url: "/dashboard/payment",
    icon: CreditCard,
  },
  {
    title: "History",
    url: "/dashboard/history",
    icon: History,
  },
];

// Organization info
const organization = {
  name: "Friends Juice Bar",
  type: "Customer Portal",
  logo: "/next.svg", // You can replace this with your actual logo
};

// User info (you can get this from your auth context)
const user = {
  name: "Customer User",
  email: "customer@friendsjuicebar.com",
  avatar: "/uploads/1761354191738-profile_light_mode-CWRh1joI.jpg",
};

function DashboardSidebarContent() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-3 p-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Link href="/">
              <Building2 className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{organization.name}</span>
            <span className="text-xs text-muted-foreground">
              {organization.type}
            </span>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto h-6 w-6">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dashboardNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Start New Order">
                  <Link href="/menu">
                    <ShoppingCart className="h-4 w-4" />
                    <span>New Order</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="View Rewards">
                  <Link href="/rewards">
                    <Gift className="h-4 w-4" />
                    <span>My Rewards</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <div className="flex items-center gap-3 p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-medium truncate">{user.name}</span>
            <span className="text-xs text-muted-foreground truncate">
              {user.email}
            </span>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
        <Separator />
        <div className="p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </>
  );
}

export function DashboardSidebar() {
  return (
    <Sidebar variant="inset" className="border-r">
      <DashboardSidebarContent />
    </Sidebar>
  );
}
