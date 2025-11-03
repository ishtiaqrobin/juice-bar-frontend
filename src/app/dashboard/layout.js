"use client";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { SidebarInset, SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const segments = pathname?.split("/").filter(Boolean) ?? [];
    const isOnDashboardRoot = segments.length <= 1; // ["dashboard"]

    const trailSegments = segments.slice(1);

    const formatLabel = (segment) => {
        return segment
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
    };

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
                                {!isOnDashboardRoot && (
                                    <>
                                        <BreadcrumbSeparator className="hidden md:block" />
                                        {trailSegments.map((segment, index) => {
                                            const href = "/" + segments.slice(0, index + 2).join("/");
                                            const isLast = index === trailSegments.length - 1;
                                            return (
                                                <>
                                                    <BreadcrumbItem key={href}>
                                                        {isLast ? (
                                                            <BreadcrumbPage>{formatLabel(segment)}</BreadcrumbPage>
                                                        ) : (
                                                            <BreadcrumbLink href={href}>{formatLabel(segment)}</BreadcrumbLink>
                                                        )}
                                                    </BreadcrumbItem>
                                                    {!isLast && (
                                                        <BreadcrumbSeparator className="hidden md:block" />
                                                    )}
                                                </>
                                            );
                                        })}
                                    </>
                                )}
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
