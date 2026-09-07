import api from "../api/axios";
import type {
  EmployeeRecord,
  EmployeeStatus,
  DesignationHistory,
} from "../types/employee";

export type Supervisor = Pick<
  EmployeeRecord,
  "emp_id" | "emp_code" | "first_name" | "last_name" | "designation"
>;

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

export const getEmployeeById = async (
  empId: number,
): Promise<{
  success: boolean;
  data: EmployeeRecord;
}> => {
  const response = await api.get(`/employees/${empId}`);
  return response.data;
};

export const getMyProfile = async (): Promise<{
  success: boolean;
  data: EmployeeRecord;
}> => {
  const response = await api.get("/employees/myprofile");
  return response.data;
};

export const updateMyProfile = async (profileData: FormData) => {
  const response = await api.put("/employees/myprofile", profileData);
  return response.data;
};

export const getAllSupervisors = async (): Promise<{
  success: boolean;
  supervisors: Supervisor[];
}> => {
  const response = await api.get("/employees/supervisors");
  return response.data;
};

export const createEmployee = async (employeeData: FormData) => {
  const response = await api.post("/employees/create", employeeData);

  return response.data;
};

export const updateEmployee = async (empId: number, employeeData: FormData) => {
  const response = await api.put(`/employees/${empId}`, employeeData);
  return response.data;
};

export const deleteEmployee = async (empId: number) => {
  const response = await api.delete(`/employees/${empId}`);
  return response.data;
};

export const getEmployeeDesignationHistory = async (
  emp_id: number,
): Promise<{
  success: boolean;
  data: DesignationHistory[];
}> => {
  const response = await api.get(`/designations/${emp_id}/history`);

  return response.data;
};

// Update employee designation
export const updateEmployeeDesignation = async (
  emp_id: number,
  designation: string,
  effective_from: string,
) => {
  const response = await api.post(`/designations/${emp_id}/update`, {
    designation,
    effective_from,
  });

  return response.data;
};
