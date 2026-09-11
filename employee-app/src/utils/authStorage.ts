const TOKEN_KEY = "attendance_token";
const EMPLOYEE_KEY = "attendance_employee";
const PERMISSIONS_KEY = "attendance_permissions";

export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
};

export const saveAuthSession = (
  token: string,
  employee: unknown,
  permissions: unknown[],
  rememberMe: boolean,
) => {
  // Clear old session first
  clearAuthSession();

  const storage = rememberMe ? localStorage : sessionStorage;

  storage.setItem(TOKEN_KEY, token);
  storage.setItem(EMPLOYEE_KEY, JSON.stringify(employee));
  storage.setItem(PERMISSIONS_KEY, JSON.stringify(permissions));
};

export const clearAuthSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EMPLOYEE_KEY);
  localStorage.removeItem(PERMISSIONS_KEY);

  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(EMPLOYEE_KEY);
  sessionStorage.removeItem(PERMISSIONS_KEY);
};
