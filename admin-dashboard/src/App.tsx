import { useCallback, useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./components/Login";
import AppLayout from "./layouts/AppLayout";
// import NotFound from "./components/NotFound";

import { clearAuthentication, getInitialAuthState } from "./auth/authStorage";
import { useSessionTimeout } from "./auth/useSessionTimeout";

function App() {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] =
    useState<boolean>(getInitialAuthState);

  const handleLogout = useCallback(() => {
    clearAuthentication();
    setIsAuthenticated(false);
    navigate("/login", { replace: true });
  }, [navigate]);

  useEffect(() => {
    const syncAuthState = () => {
      setIsAuthenticated(getInitialAuthState());
    };

    window.addEventListener("auth:change", syncAuthState);

    return () => {
      window.removeEventListener("auth:change", syncAuthState);
    };
  }, []);

  useSessionTimeout({
    isAuthenticated,
    onLogout: handleLogout,
  });

  return (
    <>
      <Routes>
        {/* Login */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Login
                onLoginSuccess={() => {
                  setIsAuthenticated(true);
                  navigate("/", { replace: true });
                }}
              />
            )
          }
        />

        {/* Authenticated application */}
        {isAuthenticated && (
          <Route path="/*" element={<AppLayout onLogout={handleLogout} />} />
        )}

        {/* Unauthenticated fallback */}
        {!isAuthenticated && (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}

export default App;
