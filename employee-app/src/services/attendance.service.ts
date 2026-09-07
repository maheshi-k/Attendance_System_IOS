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
  const now = new Date();

  const client_date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  const client_time = [
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
  ].join(":");

  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL ?? "/api"}/attendance/check`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("attendance_token") ?? ""}`,
      },
      body: JSON.stringify({
        qr_token,
        client_date,
        client_time,
      }),
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
