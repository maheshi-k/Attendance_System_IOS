import api from "../api/axios";
import type { EmployeeRecord, EmployeeStatus } from "../types/employee";

export const getAllEmployees = async (): Promise<{
  success: boolean;
  data: EmployeeRecord[];
}> => {
  const response = await api.get("/employees");
  return response.data;
};

export const getEmployeesByStatus = async (status: EmployeeStatus) => {
  const response = await api.get(
    `/employees/status/${encodeURIComponent(status)}`,
  );

  return response.data;
};
