import { useEffect } from "react";
import { clearAuthentication } from "./authStorage";

const INACTIVITY_TIMEOUT_MS = 10 * 60 * 1000;

const SESSION_EXPIRY_KEY = "attendance_session_expiry";

type UseSessionTimeoutProps = {
  isAuthenticated: boolean;
  onLogout: () => void;
};

export function useSessionTimeout({
  isAuthenticated,
  onLogout,
}: UseSessionTimeoutProps) {
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let inactivityTimer: number;

    const logout = () => {
      clearAuthentication();
      onLogout();
    };

    const getRemainingSessionTime = () => {
      const expiry = localStorage.getItem(SESSION_EXPIRY_KEY);

      if (!expiry) {
        return 0;
      }

      const expiryTime = Number(expiry);

      if (Number.isNaN(expiryTime)) {
        return 0;
      }

      return Math.max(0, expiryTime - Date.now());
    };

    const startTimer = () => {
      window.clearTimeout(inactivityTimer);

      const remainingTime = getRemainingSessionTime();

      if (remainingTime <= 0) {
        logout();
        return;
      }

      inactivityTimer = window.setTimeout(logout, remainingTime);
    };

    const resetInactivityTimer = () => {
      // Do not recreate the session after logout
      if (!localStorage.getItem("attendance_token")) {
        return;
      }

      const newExpiry = Date.now() + INACTIVITY_TIMEOUT_MS;

      localStorage.setItem(SESSION_EXPIRY_KEY, String(newExpiry));

      startTimer();
    };

    startTimer();

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
  }, [isAuthenticated, onLogout]);
}
