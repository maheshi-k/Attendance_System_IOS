import { Navigate, Route, Routes } from "react-router-dom";

import Dashboard from "../components/Dashboard";
import Attendance from "../components/Attendance/Attendance";
import Employee from "../components/Employee/Employee";
import AddEmployee from "../components/Employee/EmployeeForm";
import LeaveRequests from "../components/leaves/LeaveRequests";
import MyLeaveRequests from "../components/leaves/MyLeaveRequests";
import LeaveTypes from "../components/leaves/LeaveTypes";
import Settings from "../components/Settings";
import Profile from "../components/Profile/Profile";

import ProtectedRoute from "./ProtectedRoute";

import { menuItems, bottomItems } from "../config/navigation";
import { getStoredPermissions } from "../auth/authStorage";

function AppRoutes() {
  const permissions = getStoredPermissions();

  const accessiblePaths = [
    ...menuItems.flatMap((item) => {
      if (item.disabled) {
        return [];
      }

      if (item.children) {
        return item.children
          .filter(
            (child) =>
              !child.permission || permissions.includes(child.permission),
          )
          .map((child) => child.path)
          .filter((path): path is string => Boolean(path));
      }

      if (!item.permission || permissions.includes(item.permission)) {
        return item.path ? [item.path] : [];
      }

      return [];
    }),

    ...bottomItems
      .filter((item) => item.path)
      .map((item) => item.path)
      .filter((path): path is string => Boolean(path)),
  ];

  const defaultPath = accessiblePaths.includes("/dashboard")
    ? "/dashboard"
    : (accessiblePaths[0] ?? "/login");

  const canAccess = (path: string) => accessiblePaths.includes(path);

  return (
    <Routes>
      <Route path="/" element={<Navigate to={defaultPath} replace />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute
            allowed={canAccess("/dashboard")}
            redirectTo={defaultPath}
          >
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/attendance"
        element={
          <ProtectedRoute
            allowed={canAccess("/attendance")}
            redirectTo={defaultPath}
          >
            <Attendance />
          </ProtectedRoute>
        }
      />

      <Route
        path="/attendance/add"
        element={
          <Navigate
            to={canAccess("/attendance") ? "/attendance" : defaultPath}
            replace
          />
        }
      />

      <Route
        path="/attendance/:id/edit"
        element={
          <Navigate
            to={canAccess("/attendance") ? "/attendance" : defaultPath}
            replace
          />
        }
      />

      <Route
        path="/leaves/requests"
        element={
          <ProtectedRoute
            allowed={canAccess("/leaves/requests")}
            redirectTo={defaultPath}
          >
            <LeaveRequests />
          </ProtectedRoute>
        }
      />

      <Route
        path="/leaves/types"
        element={
          <ProtectedRoute
            allowed={canAccess("/leaves/types")}
            redirectTo={defaultPath}
          >
            <LeaveTypes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/leaves/my-requests"
        element={
          <ProtectedRoute
            allowed={canAccess("/leaves/my-requests")}
            redirectTo={defaultPath}
          >
            <MyLeaveRequests />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employees"
        element={
          <ProtectedRoute
            allowed={canAccess("/employees")}
            redirectTo={defaultPath}
          >
            <Employee />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employees/add"
        element={
          <ProtectedRoute
            allowed={canAccess("/employees")}
            redirectTo={defaultPath}
          >
            <AddEmployee />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employees/:id/edit"
        element={
          <ProtectedRoute
            allowed={canAccess("/employees")}
            redirectTo={defaultPath}
          >
            <AddEmployee />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute
            allowed={canAccess("/reports")}
            redirectTo={defaultPath}
          >
            <div>Reports</div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute
            allowed={canAccess("/settings")}
            redirectTo={defaultPath}
          >
            <Settings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute allowed={true} redirectTo={defaultPath}>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to={defaultPath} replace />} />
    </Routes>
  );
}

export default AppRoutes;
