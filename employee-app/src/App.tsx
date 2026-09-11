import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useCallback } from "react";
import { useAuth } from "./context/AuthContext";
import "react-toastify/dist/ReactToastify.css";

import LoginPage from "./components/auth/LoginPage";
import HomePage from "./components/home/HomePage";
import AttendanceHistory from "./pages/AttendanceHistory";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import EmployeeLayout from "./layouts/EmployeeLayout";
import AttendanceScan from "./pages/AttendanceScan";
import { useInactivityLogout } from "./hooks/useInactivityLogout";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = useCallback(() => {
    logout();

    navigate("/login", {
      replace: true,
    });
  }, [logout, navigate]);

  useInactivityLogout(isAuthenticated, handleLogout);

  return (
    <>
      <Routes>
        {/* Login */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate
                to={new URLSearchParams(location.search).get("returnTo") || "/"}
                replace
              />
            ) : (
              <LoginPage />
            )
          }
        />

        <Route path="/attendance/scan" element={<AttendanceScan />} />

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
