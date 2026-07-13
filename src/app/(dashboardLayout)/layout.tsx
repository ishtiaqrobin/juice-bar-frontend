"use client";

import React from "react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import {
  SidebarInset,
  SidebarTrigger,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { BottomTabBar } from "@/components/layout/mobile/BottomTabBar";

export default function DashboardLayout({
  children,
  admin,
  user,
}: Readonly<{
  children: React.ReactNode;
  admin: React.ReactNode;
  user: React.ReactNode;
}>) {
  const { user: userState, isLoading } = useAuth();
  const pathname = usePathname();

  // Split pathname and filter out empty strings
  const segments = pathname?.split("/").filter(Boolean) ?? [];

  const formatLabel = (segment: string) => {
    return segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // role load হওয়ার আগে কিছু দেখাবে না
  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-primary border-t-transparent" />
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                {segments.map((segment, index) => {
                  const href = `/${segments.slice(0, index + 1).join("/")}`;
                  const isLast = index === segments.length - 1;

                  return (
                    <React.Fragment key={href}>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage>
                            {formatLabel(segment)}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={href}>
                            {formatLabel(segment)}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </React.Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <div className="flex-1 p-4 md:p-6">
            {/* Render parallel routes based on user role */}
            {userState?.role === "ADMIN" && admin}
            {userState?.role === "USER" && user}
            {!userState?.role && children}
          </div>
        </SidebarInset>

        {/* <div className="h-20 md:hidden" /> 
                <BottomTabBar /> */}
      </div>
    </SidebarProvider>
  );
}
