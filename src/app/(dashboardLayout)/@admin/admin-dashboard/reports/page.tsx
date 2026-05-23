"use client";

import React from "react";
import AdminReportingCenter from "@/components/admin/AdminReportingCenter";
import { Clock, Info, ShieldCheck } from "lucide-react";

export default function ReportsPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        System Reports
                    </h1>
                    <p className="text-muted-foreground">
                        Generate, view, and export detailed business reports and audit logs.
                    </p>
                </div>
            </div>

            {/* Reports Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                    <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-blue-900">SECURE</h4>
                        <p className="text-xs text-blue-700/70">Encrypted Data Fetching</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                    <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                        <Clock className="h-6 w-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-emerald-900">REAL-TIME</h4>
                        <p className="text-xs text-emerald-700/70">Up-to-the-minute metrics</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
                    <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
                        <Info className="h-6 w-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-amber-900">AUDIT READY</h4>
                        <p className="text-xs text-amber-700/70">Export for compliance</p>
                    </div>
                </div>
            </div>

            <AdminReportingCenter />
        </div>
    );
}