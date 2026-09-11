import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getMyProfile } from "../services/employee.service";
import type { MyProfile } from "../types/employee.types";
import { useAuth } from "./AuthContext";

type EmployeeContextType = {
  employee: MyProfile | null;
  setEmployee: React.Dispatch<React.SetStateAction<MyProfile | null>>;
  loading: boolean;
};

const EmployeeContext = createContext<EmployeeContextType | undefined>(
  undefined,
);

export function EmployeeProvider({ children }: { children: ReactNode }) {
  const { employee: authEmployee, isAuthenticated } = useAuth();

  const [employee, setEmployee] = useState<MyProfile | null>(
    authEmployee as MyProfile | null,
  );

  const [loading, setLoading] = useState(!authEmployee);

  useEffect(() => {
    if (!isAuthenticated) {
      setEmployee(null);
      setLoading(false);
      return;
    }

    if (authEmployee) {
      setEmployee(authEmployee as MyProfile);
      setLoading(false);
    } else {
      setLoading(true);
    }

    let cancelled = false;

    getMyProfile()
      .then((data) => {
        if (!cancelled) {
          setEmployee(data);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error("Failed to load employee profile:", error);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, authEmployee]);

  return (
    <EmployeeContext.Provider value={{ employee, setEmployee, loading }}>
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployee() {
  const context = useContext(EmployeeContext);

  if (!context) {
    throw new Error("useEmployee must be used inside EmployeeProvider");
  }

  return context;
}
