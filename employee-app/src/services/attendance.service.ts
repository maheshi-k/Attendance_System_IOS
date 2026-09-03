import type {
  EmployeeAttendanceRecord,
  SelfAttendance,
} from "../types/attendance.types";

export const getSelfAttendance = async (): Promise<SelfAttendance> => {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL ?? "/api"}/attendance/self`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("attendance_token") ?? ""}`,
      },
    },
  );

  const result = (await response.json()) as {
    data?: SelfAttendance;
    message?: string;
  };

  if (!response.ok || !result.data) {
    throw new Error(result.message ?? "Unable to load attendance");
  }

  return result.data;
};

export const checkAttendance = async (qr_token: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL ?? "/api"}/attendance/check`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("attendance_token") ?? ""}`,
      },
      body: JSON.stringify({ qr_token }),
    },
  );

  const result = (await response.json()) as {
    data?: EmployeeAttendanceRecord;
    message?: string;
  };

  if (!response.ok || !result.data) {
    throw new Error(result.message ?? "Unable to mark attendance");
  }

  return result.data;
};
