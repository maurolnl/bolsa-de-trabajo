import { PATHS } from "@/router/paths";
import { LayoutDashboardIcon, ChartSpline, LucideIcon } from "lucide-react";

export type SidebarItem = {
  title: string;
  icon: LucideIcon;
  to: string;
};

export type SidebarConfigType = {
  [key: string]: {
    title: string;
    children: SidebarItem[];
  };
};

export const sidebarConfig: SidebarConfigType = {
  dashboard: {
    title: "Dashboard",
    children: [
      {
        title: "Home",
        icon: LayoutDashboardIcon,
        to: PATHS.main.home,
      },
    ],
  },
  analytics: {
    title: "Analytics",
    children: [
      {
        title: "Overview",
        icon: ChartSpline,
        to: PATHS.main.analytics,
      },
    ],
  },
};
