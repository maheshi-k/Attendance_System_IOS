import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Employee from "./components/Employee/Employee";
import AddEmployee from "./components/Employee/EmployeeForm";
import Attendance from "./components/Attendance/Attendance";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import LeaveRequests from "./components/leaves/LeaveRequests";
import MyLeaveRequests from "./components/leaves/MyLeaveRequests";
import LeaveTypes from "./components/leaves/LeaveTypes";
import { menuItems } from "./config/navigation";

const INACTIVITY_TIMEOUT_MS = 10 * 60 * 1000;

const clearAuthentication = () => {
  localStorage.removeItem("attendance_token");
  localStorage.removeItem("attendance_employee");
  localStorage.removeItem("attendance_permissions");
  window.dispatchEvent(new Event("auth:change"));
};

const getStoredPermissions = () => {
  try {
    const rawPermissions = localStorage.getItem("attendance_permissions");
    if (!rawPermissions) return [];

    const permissions = JSON.parse(rawPermissions);
    if (!Array.isArray(permissions)) return [];

    return permissions
      .map((permission) => permission?.permission_code)
      .filter((permission): permission is string => Boolean(permission));
  } catch {
    return [];
  }
};

const getAccessiblePaths = () => {
  const permissions = getStoredPermissions();

  return menuItems.flatMap((item) => {
    if (item.children) {
      const allowedChildren = item.children.filter(
        (child) => !child.permission || permissions.includes(child.permission),
      );

      return allowedChildren.map((child) => child.path);
    }

    if (!item.permission || permissions.includes(item.permission)) {
      return [item.path];
    }

    return [];
  });
};

function AppLayout() {
  const accessiblePaths = getAccessiblePaths();
  const defaultPath = accessiblePaths[0] ?? "/login";

  const canAccess = (path: string) => accessiblePaths.includes(path);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--primary)] text-[var(--text-primary)]">
      <Sidebar />
      <div className="flex h-screen min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Routes>
            <Route path="/" element={<Navigate to={defaultPath} replace />} />

            <Route
              path="/dashboard"
              element={
                canAccess("/dashboard") ? (
                  <Dashboard />
                ) : (
                  <Navigate to={defaultPath} replace />
                )
              }
            />

            <Route
              path="/attendance"
              element={
                canAccess("/attendance") ? (
                  <Attendance />
                ) : (
                  <Navigate to={defaultPath} replace />
                )
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
                canAccess("/leaves/requests") ? (
                  <LeaveRequests />
                ) : (
                  <Navigate to={defaultPath} replace />
                )
              }
            />

            <Route
              path="/leaves/types"
              element={
                canAccess("/leaves/types") ? (
                  <LeaveTypes />
                ) : (
                  <Navigate to={defaultPath} replace />
                )
              }
            />

            <Route
              path="/leaves/my-requests"
              element={
                canAccess("/leaves/my-requests") ? (
                  <MyLeaveRequests />
                ) : (
                  <Navigate to={defaultPath} replace />
                )
              }
            />

            <Route
              path="/employees"
              element={
                canAccess("/employees") ? (
                  <Employee />
                ) : (
                  <Navigate to={defaultPath} replace />
                )
              }
            />

            <Route
              path="/employees/add"
              element={
                canAccess("/employees") ? (
                  <AddEmployee />
                ) : (
                  <Navigate to={defaultPath} replace />
                )
              }
            />

            <Route
              path="/employees/:id/edit"
              element={
                canAccess("/employees") ? (
                  <AddEmployee />
                ) : (
                  <Navigate to={defaultPath} replace />
                )
              }
            />

            <Route
              path="/reports"
              element={
                <Navigate
                  to={canAccess("/reports") ? "/reports" : defaultPath}
                  replace
                />
              }
            />

            <Route
              path="/settings"
              element={
                <Navigate
                  to={canAccess("/settings") ? "/settings" : defaultPath}
                  replace
                />
              }
            />

            <Route path="*" element={<Navigate to={defaultPath} replace />} />
          </Routes>
        </main>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = localStorage.getItem("attendance_token");
    return Boolean(token);
  });

  useEffect(() => {
    const syncAuthState = () => {
      const token = localStorage.getItem("attendance_token");
      setIsAuthenticated(Boolean(token));
    };

    window.addEventListener("auth:change", syncAuthState);
    return () => window.removeEventListener("auth:change", syncAuthState);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    let inactivityTimer = window.setTimeout(() => {
      clearAuthentication();
      setIsAuthenticated(false);
    }, INACTIVITY_TIMEOUT_MS);

    const resetInactivityTimer = () => {
      window.clearTimeout(inactivityTimer);
      inactivityTimer = window.setTimeout(() => {
        clearAuthentication();
        setIsAuthenticated(false);
      }, INACTIVITY_TIMEOUT_MS);
    };

    const activityEvents = [
      "click",
      "keydown",
      "mousemove",
      "scroll",
      "touchstart",
    ] as const;

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, resetInactivityTimer, {
        passive: true,
      });
    });

    return () => {
      window.clearTimeout(inactivityTimer);
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, resetInactivityTimer);
      });
    };
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <>
        <Routes>
          <Route
            path="/login"
            element={<Login onLoginSuccess={() => setIsAuthenticated(true)} />}
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <ToastContainer position="bottom-right" autoClose={3000} />
      </>
    );
  }

  return <AppLayout />;
}

export default App;
