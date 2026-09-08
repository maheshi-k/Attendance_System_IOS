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

function formatLocalYYYYMMDDHHmmss(date = new Date()) {
  const pad = (num: number) => String(num).padStart(2, "0");

  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  const ss = pad(date.getSeconds());

  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

export const checkAttendance = async (qr_token: string) => {
  const now = new Date();
  const client_datetime = formatLocalYYYYMMDDHHmmss(now);

  const [client_date, client_time] = client_datetime.split(" ");

  console.log("LOCAL DATETIME:", client_datetime);
  console.log("LOCAL DATE:", client_date);
  console.log("LOCAL TIME:", client_time);

  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL ?? "/api"}/attendance/check`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          localStorage.getItem("attendance_token") ?? ""
        }`,
      },
      body: JSON.stringify({
        qr_token,
        client_date,
        client_time,
        client_datetime,
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

  return {
    data: result.data,
    client_time,
  };
};
