import {
  LayoutDashboard,
  CalendarDays,
  Users,
  BarChart3,
  Settings,
  QrCode,
  LogOut,
  UserShield,
} from "lucide-react";

type NavigationItem =
  | {
      label: string;
      icon: typeof LayoutDashboard;
      path: string;
      action?: never;
    }
  | {
      label: string;
      icon: typeof LayoutDashboard;
      action: "logout";
      path?: never;
    };

export const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    label: "Attendance",
    icon: QrCode,
    path: "/attendance",
  },
  {
    label: "Leaves",
    icon: CalendarDays,
    expandable: true,
    children: [
      {
        label: "Leave Requests",
        path: "/leaves/requests",
      },
      {
        label: "Leave Types",
        path: "/leaves/types",
      },
    ],
  },
  {
    label: "Employees",
    icon: Users,
    path: "/employees",
  },
  {
    label: "Reports",
    icon: BarChart3,
    path: "/reports",
  },
  {
    label: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export const bottomItems: NavigationItem[] = [
  {
    label: "Profile",
    icon: UserShield,
    path: "/profile",
  },
  {
    label: "Logout",
    icon: LogOut,
    action: "logout",
  },
];
