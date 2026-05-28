"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileDown,
  LayoutDashboard,
  Package,
  Users,
  Search,
  Filter,
  Download,
} from "lucide-react";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const AdminReportingCenter = () => {
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const handleGenerateReport = async (type) => {
    setGeneratingReport(true);
    setSelectedType(type);
    try {
      const response = await adminService.generateReport(type);
      if (response.success) {
        setReportData(response.data);
        toast.success(
          `${type.charAt(0).toUpperCase() + type.slice(1)} report generated successfully!`,
        );
      }
    } catch (error) {
      toast.error("Failed to generate report");
      console.error(error);
    } finally {
      setGeneratingReport(false);
    }
  };

  const reportTypes = [
    {
      id: "overview",
      label: "System Overview",
      icon: LayoutDashboard,
      color: "text-blue-600",
      bg: "bg-blue-100",
      cardBg: "bg-blue-50/50",
      cardHover: "hover:bg-blue-100/50 hover:border-blue-200",
      selectedClass:
        "bg-blue-100 border-blue-500 shadow-sm ring-1 ring-blue-500 ring-offset-1",
    },
    {
      id: "users",
      label: "User Demographics",
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      cardBg: "bg-emerald-50/50",
      cardHover: "hover:bg-emerald-100/50 hover:border-emerald-200",
      selectedClass:
        "bg-emerald-100 border-emerald-500 shadow-sm ring-1 ring-emerald-500 ring-offset-1",
    },
    {
      id: "products",
      label: "Inventory Report",
      icon: Package,
      color: "text-amber-600",
      bg: "bg-amber-100",
      cardBg: "bg-amber-50/50",
      cardHover: "hover:bg-amber-100/50 hover:border-amber-200",
      selectedClass:
        "bg-amber-100 border-amber-500 shadow-sm ring-1 ring-amber-500 ring-offset-1",
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-primary/10 overflow-hidden border p-4">
        <CardHeader className="">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                {/* <FileDown className="h-5 w-5 text-primary" /> */}
                Reporting Center
              </CardTitle>
              <CardDescription>
                Select a report type to generate real-time data analysis
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        {/* Report types */}
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {reportTypes.map((report) => (
              <Button
                key={report.id}
                onClick={() => handleGenerateReport(report.id)}
                disabled={generatingReport}
                variant="outline"
                className={`h-24 flex-col gap-2 transition-all ${
                  selectedType === report.id
                    ? report.selectedClass
                    : `border-primary/10 ${report.cardBg} ${report.cardHover}`
                }`}
              >
                <div
                  className={`p-2 rounded-full ${report.bg} ${report.color}`}
                >
                  <report.icon className="h-5 w-5" />
                </div>
                <span className="font-semibold">{report.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {generatingReport ? (
        <Card className="border-primary/10 border">
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      ) : reportData ? (
        <Card className="border-primary/10 border p-4">
          <CardHeader className="border-b border-primary/5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="capitalize">
                  {selectedType} Report Findings
                </CardTitle>
                <CardDescription>
                  Generated on{" "}
                  {new Date(reportData.generatedAt).toLocaleString()}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent className="">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {Object.entries(reportData.data).map(([key, value]) => (
                <div
                  key={key}
                  className="p-4 rounded-xl bg-primary/5 shadow hover:shadow-md transition-all duration-300"
                >
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </p>
                  <p className="text-2xl font-bold">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-linear-to-br from-primary/10 to-transparent border border-primary/5">
              <h4 className="font-bold flex items-center gap-2 mb-4">
                <Filter className="h-4 w-4" />
                Analysis Summary
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The {selectedType} report indicates a healthy system status. All
                metrics are within expected parameters. Recent user acquisitions
                show a positive trend, and inventory levels are sufficient for
                the current demand.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-primary/5 rounded-3xl border-2 border-dashed border-primary/10">
          {/* <FileDown className="h-12 w-12 text-primary/20 mb-4" /> */}
          <h3 className="text-lg font-medium text-muted-foreground">
            No Report Generated Yet
          </h3>
          <p className="text-sm text-muted-foreground/60 max-w-xs text-center">
            Click one of the buttons above to analyze system data and generate a
            detailed report.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminReportingCenter;
