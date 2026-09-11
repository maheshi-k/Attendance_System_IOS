import { Navigate, useLocation } from "react-router-dom";
import AttendanceConfirmation from "./AttendanceConfirmation";
import { useAuth } from "../context/AuthContext";

function AttendanceScan() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  // No QR token
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // QR was scanned, but user is not logged in
  if (!isAuthenticated) {
    const returnTo = `${location.pathname}${location.search}`;

    return (
      <Navigate
        to={`/login?returnTo=${encodeURIComponent(returnTo)}`}
        replace
      />
    );
  }

  // User is authenticated → show confirmation
  return <AttendanceConfirmation token={token} />;
}

export default AttendanceScan;
