import {
  LayoutDashboard,
  CalendarDays,
  Users,
  // BarChart3,
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
      permission?: string;
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
    permission: "DASHBOARD_VIEW",
  },
  {
    label: "Attendance",
    icon: QrCode,
    path: "/attendance",
    // permission: "ATTENDANCE_VIEW",
  },
  {
    label: "Leaves",
    icon: CalendarDays,
    expandable: true,
    disabled: true,
    children: [
      {
        label: "Request Management",
        path: "/leaves/requests",
        permission: "LEAVE_VIEW",
      },
      {
        label: "Leave Management",
        path: "/leaves/my-requests",
        permission: "LEAVE_HISTORY_VIEW",
      },
      {
        label: "Leave Types",
        path: "/leaves/types",
        permission: "LEAVE_VIEW",
      },
    ],
  },
  {
    label: "Employees",
    icon: Users,
    path: "/employees",
    permission: "EMPLOYEE_VIEW",
  },
  // {
  //   label: "Reports",
  //   icon: BarChart3,
  //   path: "/reports",
  //   permission: "REPORT_VIEW",
  // },
  {
    label: "Settings",
    icon: Settings,
    path: "/settings",
    permission: "SETTINGS_VIEW",
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
