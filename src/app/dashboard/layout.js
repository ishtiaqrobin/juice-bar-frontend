"use client";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { SidebarInset, SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function DashboardLayout({ children }) {
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
                                    <BreadcrumbLink href="/dashboard">
                                        Dashboard
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Current Page</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </header>
                    <div className="flex-1 p-4">
                        {children}
                    </div>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
