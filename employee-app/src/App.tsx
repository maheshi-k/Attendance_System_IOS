import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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

    setIsAuthenticated(false);
    navigate("/login", { replace: true });
  };

  useInactivityLogout(isAuthenticated, handleLogout);

  return (
    <>
      <Routes>
        {/* Login */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
          }
        />

        {/* Authenticated pages */}
        {isAuthenticated && (
          <Route element={<EmployeeLayout onLogout={handleLogout} />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/attendance-history" element={<AttendanceHistory />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        )}

        {/* Unauthenticated users trying to access app */}
        {!isAuthenticated && (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}

        {/* Authenticated 404 */}
        {isAuthenticated && <Route path="*" element={<NotFound />} />}
      </Routes>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}

export default App;
