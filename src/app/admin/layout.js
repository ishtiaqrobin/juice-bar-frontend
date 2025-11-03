"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SidebarInset, SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const segments = pathname?.split("/").filter(Boolean) ?? [];
    const isOnAdminRoot = segments.length <= 1; // ["admin"]

    // Build breadcrumb items for segments after "admin"
    const trailSegments = segments.slice(1);

    const formatLabel = (segment) => {
        return segment
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
    };

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
                                {!isOnAdminRoot && (
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
