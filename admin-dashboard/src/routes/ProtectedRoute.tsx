import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  allowed: boolean;
  redirectTo: string;
  children: React.ReactNode;
};

function ProtectedRoute({
  allowed,
  redirectTo,
  children,
}: ProtectedRouteProps) {
  if (!allowed) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}

export default ProtectedRoute;
