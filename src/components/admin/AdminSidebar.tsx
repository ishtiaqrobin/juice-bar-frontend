"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  // ChevronDown,
  Home,
  Package,
  Settings,
  Users,
  // BarChart3,
  FileText,
  LogOut,
  Plus,
  List,
  Tag,
  Image,
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

// Navigation items for admin panel
const adminNavItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Banners",
    url: "/admin/banners",
    icon: Image,
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: Package,
  },
  {
    title: "Add Product",
    url: "/admin/products/new",
    icon: Plus,
  },
  {
    title: "Categories",
    url: "/admin/categories",
    icon: Tag,
  },
  {
    title: "Featured",
    url: "/admin/featured",
    icon: List,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
  },
  // {
  //   title: "Analytics",
  //   url: "/admin/analytics",
  //   icon: BarChart3,
  // },
  // {
  //   title: "Reports",
  //   url: "/admin/reports",
  //   icon: FileText,
  // },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
];

// Organization info
const organization = {
  name: "Friends Juice Bar",
  type: "Restaurant",
  logo: "/next.svg", // You can replace this with your actual logo
};

function AdminSidebarContent() {
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
              {adminNavItems.map((item) => (
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
                <SidebarMenuButton asChild tooltip="Add New Product">
                  <Link href="/admin/products/new" onClick={handleLinkClick}>
                    <Package className="h-4 w-4" />
                    <span>Add Product</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="View Reports">
                  <Link href="/admin/reports" onClick={handleLinkClick}>
                    <FileText className="h-4 w-4" />
                    <span>Generate Report</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-y">
        {/* User Information */}
        {!user ? (
          <div className="flex items-center gap-3 px-4 py-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex flex-col flex-1 min-w-0 gap-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-4 py-2">
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
        <div className="px-4 py-2">
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

export function AdminSidebar() {
  return (
    <Sidebar variant="inset" className="border-r">
      <AdminSidebarContent />
    </Sidebar>
  );
}
