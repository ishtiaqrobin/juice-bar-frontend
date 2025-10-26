"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  ChevronDown,
  Home,
  Package,
  Settings,
  Users,
  // BarChart3,
  FileText,
  LogOut,
  Plus,
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

// Navigation items for admin panel
const adminNavItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: Home,
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

// User info (you can get this from your auth context)
const user = {
  name: "Admin User",
  email: "admin@friendsjuicebar.com",
  avatar: "/uploads/1761354191738-profile_light_mode-CWRh1joI.jpg",
};

function AdminSidebarContent() {
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
              {adminNavItems.map((item) => (
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
                <SidebarMenuButton asChild tooltip="Add New Product">
                  <Link href="/admin/products/new">
                    <Package className="h-4 w-4" />
                    <span>Add Product</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="View Reports">
                  <Link href="/admin/reports">
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
        <div className="flex items-center gap-3 px-4 py-2">
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
        <div className="px-4 py-2">
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

export function AdminSidebar() {
  return (
    <Sidebar variant="inset" className="border-r">
      <AdminSidebarContent />
    </Sidebar>
  );
}
