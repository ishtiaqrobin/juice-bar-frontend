"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  // ChevronDown,
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
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

// Navigation items for dashboard
const dashboardNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: User,
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
    title: "Payment",
    url: "/dashboard/payment",
    icon: CreditCard,
  },
  {
    title: "History",
    url: "/dashboard/history",
    icon: History,
  },
  // {
  //   title: "Settings",
  //   url: "/dashboard/settings",
  //   icon: Settings,
  // },
];

// Organization info
const organization = {
  name: "Friends Juice Bar",
  type: "Customer Portal",
  logo: "/next.svg", // You can replace this with your actual logo
};

function DashboardSidebarContent() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleSignOut = async () => {
    await logout();
    router.push("/");
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

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
          {/* <Button variant="ghost" size="icon" className="ml-auto h-6 w-6">
            <ChevronDown className="h-4 w-4" />
          </Button> */}
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
                    <Link href={item.url} onClick={handleLinkClick}>
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
                  <Link href="/menu" onClick={handleLinkClick}>
                    <ShoppingCart className="h-4 w-4" />
                    <span>New Order</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="View Rewards">
                  <Link href="/rewards" onClick={handleLinkClick}>
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
        {/* User Information */}
        {!user ? (
          <div className="flex items-center gap-3 p-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex flex-col flex-1 min-w-0 gap-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user?.image || ""}
                alt={user?.name || ""}
              />
              <AvatarFallback>
                {user?.name?.charAt(0) || ""}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-medium truncate">
                {user?.name || ""}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {user?.email || ""}
              </span>
            </div>
          </div>
        )}
        <Separator />
        <div className="p-2">
          <Button
            onClick={handleSignOut}
            variant="ghost"
            size="sm"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 hover:cursor-pointer"
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
