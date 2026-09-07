const TOKEN_KEY = "attendance_token";
const EMPLOYEE_KEY = "attendance_employee";
const PERMISSIONS_KEY = "attendance_permissions";
const SESSION_EXPIRY_KEY = "attendance_session_expiry";

export const getStoredEmployee = <T>(): T | null => {
  try {
    const rawEmployee = localStorage.getItem(EMPLOYEE_KEY);
    return rawEmployee ? (JSON.parse(rawEmployee) as T) : null;
  } catch {
    return null;
  }
};

export const clearAuthentication = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EMPLOYEE_KEY);
  localStorage.removeItem(PERMISSIONS_KEY);
  localStorage.removeItem(SESSION_EXPIRY_KEY);

  window.dispatchEvent(new Event("auth:change"));
};

export const getInitialAuthState = (): boolean => {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(SESSION_EXPIRY_KEY);

  if (!token) {
    return false;
  }

  if (!expiry) {
    clearAuthentication();
    return false;
  }

  const expiryTime = Number(expiry);

  if (Number.isNaN(expiryTime)) {
    clearAuthentication();
    return false;
  }

  if (Date.now() >= expiryTime) {
    clearAuthentication();
    return false;
  }

  return true;
};

export const getStoredPermissions = (): string[] => {
  try {
    const rawPermissions = localStorage.getItem(PERMISSIONS_KEY);

    if (!rawPermissions) {
      return [];
    }

    const permissions = JSON.parse(rawPermissions);

    if (!Array.isArray(permissions)) {
      return [];
    }

    return permissions
      .map((permission) => permission?.permission_code)
      .filter((permission): permission is string => Boolean(permission));
  } catch {
    return [];
  }
};
