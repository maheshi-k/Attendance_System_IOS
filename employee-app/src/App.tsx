import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoginPage from "./components/auth/LoginPage";
import HomePage from "./components/home/HomePage";
import AttendanceHistory from "./pages/AttendanceHistory";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import EmployeeLayout from "./layouts/EmployeeLayout";
import { useInactivityLogout } from "./hooks/useInactivityLogout";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(localStorage.getItem("attendance_token")),
  );

  useEffect(() => {
    const syncAuthState = () => {
      setIsAuthenticated(Boolean(localStorage.getItem("attendance_token")));
    };

    window.addEventListener("auth:change", syncAuthState);

    return () => {
      window.removeEventListener("auth:change", syncAuthState);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("attendance_token");
    localStorage.removeItem("attendance_employee");
    localStorage.removeItem("attendance_permissions");

    window.dispatchEvent(new Event("auth:change"));
  };

  useInactivityLogout(isAuthenticated, handleLogout);

  return (
    <>
      {isAuthenticated ? (
        <Routes>
          <Route element={<EmployeeLayout onLogout={handleLogout} />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/attendance-history" element={<AttendanceHistory />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      ) : (
        <LoginPage />
      )}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}

export default App;
