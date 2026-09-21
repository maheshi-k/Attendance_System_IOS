import type { ExportColumn } from "../components/common/ExportData";
import { OFFICE_CLOSE_HOUR, OFFICE_CLOSE_MINUTE } from "../config/app.config";
import type {
  AttendanceExportRow,
  AttendanceRecord,
} from "../types/attendance";
import type { EmployeeRecord } from "../types/employee";

//AttendanceTable Related functions
export function statusClass(status: string) {
  if (status === "Present") return "bg-[#e4f0db] text-[#416900]";
  if (status === "Late") return "bg-[#ffe1df] text-[#ba1a1a]";
  if (status === "Absent") return "bg-[#e8e9e9] text-[#625e58]";
  return "bg-[#fff0d1] text-[#a15c00]";
}

export function groupAttendanceByDate(records: AttendanceRecord[]) {
  const groups = new Map<string, AttendanceRecord[]>();

  const sortedRecords = [...records].sort((a, b) => {
    const dateA = new Date(
      `${a.att_date.slice(0, 10)}T${a.check_in ?? "00:00:00"}`,
    ).getTime();

    const dateB = new Date(
      `${b.att_date.slice(0, 10)}T${b.check_in ?? "00:00:00"}`,
    ).getTime();

    return dateB - dateA;
  });

  sortedRecords.forEach((record) => {
    const date = record.att_date.slice(0, 10);

    const group = groups.get(date) ?? [];

    group.push(record);

    groups.set(date, group);
  });

  return Array.from(groups.entries());
}

export function formatAttendanceDate(date: string) {
  return new Date(`${date}T00:00:00`)
    .toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
    .toUpperCase();
}

export function calculateHours(checkIn: string, checkOut: string) {
  const [inHours, inMinutes] = checkIn.split(":").map(Number);
  const [outHours, outMinutes] = checkOut.split(":").map(Number);
  const minutes = Math.max(
    0,
    outHours * 60 + outMinutes - inHours * 60 - inMinutes,
  );
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}h ${String(minutes % 60).padStart(2, "0")}m`;
}

export function isToday(dateValue: string) {
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return dateValue.slice(0, 10) === todayKey;
}

export function formatOpenHours(checkIn: string, now: Date) {
  const [checkInHours, checkInMinutes] = checkIn.split(":").map(Number);

  const checkInTotal = checkInHours * 60 + checkInMinutes;
  const currentTotal = now.getHours() * 60 + now.getMinutes();

  const officeClosingTime = OFFICE_CLOSE_HOUR * 60 + OFFICE_CLOSE_MINUTE;

  const endTotal = Math.min(currentTotal, officeClosingTime);
  const elapsed = Math.max(0, endTotal - checkInTotal);

  return `${String(Math.floor(elapsed / 60)).padStart(2, "0")}h ${String(
    elapsed % 60,
  ).padStart(2, "0")}m`;
}

//Attendance Page related functions

export const attendanceExportColumns: ExportColumn<AttendanceExportRow>[] = [
  { header: "Employee", value: "employee" },
  { header: "Employee ID", value: "employeeId" },
  { header: "Date", value: "date" },
  { header: "Check In", value: "checkIn" },
  { header: "Check Out", value: "checkOut" },
  { header: "Hours", value: "hours" },
  { header: "Status", value: "status" },
  { header: "Location", value: "location" },
];

export const formatHours = (record: AttendanceRecord) => {
  if (!record.check_in || !record.check_out) return "00h 00m";
  const start = record.check_in.split(":").map(Number);
  const end = record.check_out.split(":").map(Number);
  const minutes = Math.max(0, end[0] * 60 + end[1] - start[0] * 60 - start[1]);
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}h ${String(minutes % 60).padStart(2, "0")}m`;
};

export const getWorkedMinutes = (
  record: AttendanceRecord,
  currentTime: Date,
): number => {
  if (!record.check_in) return 0;

  const [startHour, startMinute] = record.check_in.split(":").map(Number);

  const startMinutes = startHour * 60 + startMinute;

  let endMinutes: number;

  // If employee checked out,
  // ALWAYS use the actual checkout time.
  if (record.check_out) {
    const [endHour, endMinute] = record.check_out.split(":").map(Number);

    endMinutes = endHour * 60 + endMinute;
  } else {
    const attendanceDate = getAttendanceDateKey(record.att_date);
    const today = toDateString(currentTime);

    // Old open sessions should not continue into today.
    if (attendanceDate !== today) {
      return 0;
    }

    const currentMinutes =
      currentTime.getHours() * 60 + currentTime.getMinutes();

    const officeClosingMinutes = OFFICE_CLOSE_HOUR * 60 + OFFICE_CLOSE_MINUTE;

    endMinutes = Math.min(currentMinutes, officeClosingMinutes);
  }

  return Math.max(0, endMinutes - startMinutes);
};

export const toDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getToday = () => toDateString(new Date());

export const getAttendanceDateKey = (value: string) => {
  const trimmedValue = value.trim();
  const isoDateKey = trimmedValue.match(/^\d{4}-\d{2}-\d{2}/)?.[0];

  if (isoDateKey) {
    return isoDateKey;
  }

  const slashDateMatch = trimmedValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);

  if (slashDateMatch) {
    const [, firstPart, secondPart, year] = slashDateMatch;
    const month = Number(firstPart);
    const day = Number(secondPart);

    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  return trimmedValue;
};

export const isDateInRange = (date: string, from: string, to: string) => {
  const dateKey = getAttendanceDateKey(date);

  return (
    (!from || dateKey >= from) &&
    (!to || dateKey <= to) &&
    (!from || !to || from <= to)
  );
};

export const getExpectedEmployeeDays = (
  employees: EmployeeRecord[],
  from: string,
  to: string,
) => {
  const end = new Date(`${to}T00:00:00`);

  return employees.reduce((expectedDays, employee) => {
    const joiningDate = employee.joining_date.slice(0, 10);
    const employeeStart = new Date(
      `${joiningDate > from ? joiningDate : from}T00:00:00`,
    );
    let employeeWorkingDays = 0;
    const current = new Date(employeeStart);

    while (current <= end) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) {
        employeeWorkingDays++;
      }
      current.setDate(current.getDate() + 1);
    }

    return expectedDays + employeeWorkingDays;
  }, 0);
};
