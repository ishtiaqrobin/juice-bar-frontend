"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SidebarInset, SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function AdminLayout({ children }) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <AdminSidebar />
                <SidebarInset className="flex-1">
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/admin">
                                        Admin Dashboard
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Current Page</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </header>
                    <div className="flex-1 p-4 md:p-6">
                        {children}
                    </div>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
