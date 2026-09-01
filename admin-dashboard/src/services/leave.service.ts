import api from "../api/axios";
import type {
  LeaveRequest,
  LeaveType,
  SupervisedEmployee,
} from "../types/leaves";

export type CreateLeaveRequest = {
  leave_type_id: number;
  start_date: string;
  end_date: string;
  reason?: string;
};

export const getLeaveTypes = async (): Promise<LeaveType[]> => {
  const response = await api.get("/leave-types");

  return response.data.data;
};

export const addLeaveRequest = async (leaveRequest: CreateLeaveRequest) => {
  const response = await api.post("/leave-requests", leaveRequest);

  return response.data.data;
};

export const getLeaveRequests = async (): Promise<LeaveRequest[]> => {
  const response = await api.get("/leave-requests");

  return response.data.data;
};

export const getMyLeaveHistory = async (): Promise<LeaveRequest[]> => {
  const response = await api.get("/leave-requests/leave-history");

  return response.data.data;
};

export const getSupervisedEmployees = async (): Promise<
  SupervisedEmployee[]
> => {
  const response = await api.get("/leaves/supervised/employees");

  return response.data.data;
};
