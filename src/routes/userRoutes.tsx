import { Route } from "@/types/routes.type";
import {
  Home,
  Settings,
} from "lucide-react";

export const userRoutes: Route[] = [
  {
    title: "User Dashboard",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
      },
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings
      },
    ],
  },
];
