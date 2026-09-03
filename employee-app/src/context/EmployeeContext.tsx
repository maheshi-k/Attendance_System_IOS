import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getMyProfile } from "../services/employee.service";
import type { MyProfile } from "../types/employee.types";

type EmployeeContextType = {
  employee: MyProfile | null;
  setEmployee: React.Dispatch<React.SetStateAction<MyProfile | null>>;
  loading: boolean;
};

const EmployeeContext = createContext<EmployeeContextType | undefined>(
  undefined,
);

export function EmployeeProvider({ children }: { children: ReactNode }) {
  const [employee, setEmployee] = useState<MyProfile | null>(() => {
    const storedEmployee = localStorage.getItem("attendance_employee");

    if (!storedEmployee) {
      return null;
    }

    try {
      return JSON.parse(storedEmployee);
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyProfile()
      .then((data) => {
        setEmployee(data);
      })
      .catch((error) => {
        console.error("Failed to load employee profile:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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
