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
  // console.log("Attendance response:", response.data);
  return response.data;
};

export const getSelfAttendance = async (
  date?: string,
): Promise<{
  success: boolean;
  data: {
    today: AttendanceRecord | null;
    records: AttendanceRecord[];
    stats: {
      present_days: number;
      late_days: number;
      absent_days: number;
    };
  };
}> => {
  const response = await api.get("/attendance/self/view", {
    params: date ? { date } : undefined,
  });

  console.log("SELF ATTENDANCE FULL RESPONSE:", response);
  console.log("SELF ATTENDANCE RESPONSE DATA:", response.data);
  console.log(
    "SELF ATTENDANCE DATA.DATA:",
    response.data?.data,
    Array.isArray(response.data?.data),
  );

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
