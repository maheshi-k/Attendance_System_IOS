import { useCallback, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./components/Login";
import AppLayout from "./layouts/AppLayout";
import NotFound from "./components/NotFound";

import { clearAuthentication, getInitialAuthState } from "./auth/authStorage";

import { useSessionTimeout } from "./auth/useSessionTimeout";

function App() {
  const [isAuthenticated, setIsAuthenticated] =
    useState<boolean>(getInitialAuthState);

  const handleLogout = useCallback(() => {
    clearAuthentication();
    setIsAuthenticated(false);
  }, []);

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

  if (!isAuthenticated) {
    return (
      <>
        <Routes>
          <Route
            path="/login"
            element={<Login onLoginSuccess={() => setIsAuthenticated(true)} />}
          />

          <Route
            path="*"
            element={<NotFound homePath="/login" homeLabel="Login" />}
          />
        </Routes>

        <ToastContainer position="bottom-right" autoClose={3000} />
      </>
    );
  }

  return <AppLayout />;
}

export default App;
