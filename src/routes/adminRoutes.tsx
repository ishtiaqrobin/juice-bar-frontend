import { Route } from "@/types/routes.type";

import {
  Home,
  Package,
  Settings,
  Users,
  Plus,
  List,
  Tag,
  Image,
} from "lucide-react";

export const adminRoutes: Route[] = [
  {
    title: "Admin Dashboard",
    items: [
      {
        title: "Dashboard",
        url: "/admin-dashboard",
        icon: Home,
      },
      {
        title: "Banners",
        url: "/admin-dashboard/banners",
        icon: Image,
      },
      {
        title: "Products",
        url: "/admin-dashboard/products",
        icon: Package,
      },
      {
        title: "Add Product",
        url: "/admin-dashboard/products/new",
        icon: Plus,
      },
      {
        title: "Categories",
        url: "/admin-dashboard/categories",
        icon: Tag,
      },
      {
        title: "Featured",
        url: "/admin-dashboard/featured",
        icon: List,
      },
      {
        title: "Users",
        url: "/admin-dashboard/users",
        icon: Users,
      },
      {
        title: "Settings",
        url: "/admin-dashboard/settings",
        icon: Settings,
      },
    ],
  },
];
