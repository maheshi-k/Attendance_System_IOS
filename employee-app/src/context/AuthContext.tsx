import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

import { loginEmployee } from "../services/auth.service";
import {
  getAuthToken,
  saveAuthSession,
  clearAuthSession,
} from "../utils/authStorage";

type Employee = Record<string, unknown>;

type AuthContextType = {
  isAuthenticated: boolean;
  employee: Employee | null;

  login: (
    email: string,
    password: string,
    rememberMe: boolean,
  ) => Promise<void>;

  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(getAuthToken()),
  );

  const [employee, setEmployee] = useState<Employee | null>(() => {
    const storedEmployee =
      localStorage.getItem("attendance_employee") ||
      sessionStorage.getItem("attendance_employee");

    if (!storedEmployee) {
      return null;
    }

    try {
      return JSON.parse(storedEmployee);
    } catch {
      return null;
    }
  });

  const login = useCallback(
    async (email: string, password: string, rememberMe: boolean) => {
      const authData = await loginEmployee({
        email_1: email.trim(),
        password,
      });

      saveAuthSession(
        authData.token,
        authData.employee,
        authData.permissions ?? [],
        rememberMe,
      );

      setEmployee(authData.employee);
      setIsAuthenticated(true);
    },
    [],
  );

  const logout = useCallback(() => {
    clearAuthSession();

    setEmployee(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        employee,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
