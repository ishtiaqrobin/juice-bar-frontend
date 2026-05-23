"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { adminService } from "@/services/admin.service";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  UserPlus,
  Package,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  FolderOpen,
  Star,
  Trash2,
  RotateCw,
  AlertTriangle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ActivityIcon = ({ type }) => {
  switch (type) {
    case "USER_REGISTER":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <UserPlus className="h-4 w-4" />
        </div>
      );
    case "PRODUCT_UPDATE":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600">
          <Package className="h-4 w-4" />
        </div>
      );
    case "BANNER_UPDATE":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
          <ImageIcon className="h-4 w-4" />
        </div>
      );
    case "CATEGORY_UPDATE":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <FolderOpen className="h-4 w-4" />
        </div>
      );
    case "FEATURE_UPDATE":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
          <Star className="h-4 w-4" />
        </div>
      );
    default:
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600">
          <CheckCircle2 className="h-4 w-4" />
        </div>
      );
  }
};

const AdminRecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await adminService.getActivities();
      if (response.success) {
        setActivities(response.data);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleClearHistory = async () => {
    setIsClearing(true);
    try {
      const response = await adminService.clearActivities();
      if (response.success) {
        setActivities([]);
        toast.success("Recent activity history cleared");
      }
    } catch (error) {
      toast.error("Failed to clear history");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <Card className="h-full border-primary/10 shadow-sm overflow-hidden flex flex-col p-4">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-primary/5">
        <div className="space-y-1">
          <CardTitle className="text-lg">Recent Activity</CardTitle>
          <CardDescription>Latest events across the platform</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-green-500/70 bg-green-50 hover:text-green-500 hover:bg-green-50"
            onClick={fetchActivities}
            disabled={loading}
          >
            <RotateCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          {activities.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500/70 bg-red-50 hover:text-red-500 hover:bg-red-50"
                  disabled={isClearing}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <div className="flex items-center gap-3 mb-2">
                    {/* <div className="p-2 rounded-full bg-red-50">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    </div> */}
                    <AlertDialogTitle>Clear Activity History?</AlertDialogTitle>
                  </div>
                  <AlertDialogDescription>
                    This action will hide all current activities from your
                    dashboard. Most recent records will only appear from this
                    point forward. This operation cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearHistory}
                    className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
                  >
                    Yes, Clear All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[450px] overflow-y-auto px-6 py-6 custom-scrollbar">
          {loading ? (
            <div className="space-y-6">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                ))}
            </div>
          ) : activities.length > 0 ? (
            <div className="space-y-6">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 group">
                  <ActivityIcon type={activity.type} />
                  <div className="flex flex-col gap-1.5 pt-1">
                    <p className="text-sm font-medium leading-tight text-foreground/90 transition-colors group-hover:text-primary">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(activity.timestamp), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col h-[300px] items-center justify-center text-center p-6 bg-primary/2">
              <div className="p-4 rounded-full bg-primary/5 mb-4">
                <CheckCircle2 className="h-8 w-8 text-primary/30" />
              </div>
              <h4 className="font-semibold text-muted-foreground">
                All Caught Up!
              </h4>
              <p className="text-xs text-muted-foreground/60 max-w-[180px] mt-1">
                No recent platform activities recorded since your last check.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminRecentActivity;
