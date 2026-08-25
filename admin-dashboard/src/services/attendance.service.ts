import api from "../api/axios";
import type {
  AttendanceRecord,
  CreateAttendanceRequest,
} from "../types/attendance";

export const getAttendance = async (
  date?: string,
): Promise<{
  success: boolean;
  data: AttendanceRecord[];
}> => {
  const response = await api.get("/attendance/view", {
    params: date ? { date } : undefined,
  });

  return response.data;
};

export const addManualAttendance = async (
  attendance: CreateAttendanceRequest,
): Promise<{ success: boolean; data: AttendanceRecord }> => {
  const response = await api.post("/attendance/manual", attendance);
  return response.data;
};

export const getAttendanceById = async (
  id: number,
): Promise<{
  success: boolean;
  data: AttendanceRecord;
}> => {
  const response = await api.get(`/attendance/record/${id}`);
  return response.data;
};

export const getActiveEmployeeCount = async (): Promise<number> => {
  const response = await api.get("/employees/active/count");

  return response.data.count;
};

export const updateManualAttendance = async (
  id: number,
  attendance: CreateAttendanceRequest,
): Promise<{ success: boolean; data: AttendanceRecord }> => {
  const response = await api.put(`/attendance/${id}`, attendance);
  return response.data;
};
