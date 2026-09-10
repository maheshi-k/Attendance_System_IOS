export type AttendanceStatus = "Present" | "Late";

export type AttendanceDateRange =
  | "Today"
  | "Yesterday"
  | "This Week"
  | "This Month"
  | "Custom";

export type AttendanceRecord = {
  att_id: number;
  emp_id: number;
  emp_code: string;
  first_name: string;
  last_name: string;
  designation?: string | null;
  email?: string | null;
  profile_photo?: string | null;
  att_date: string;
  check_in?: string | null;
  check_out?: string | null;
  status: AttendanceStatus | string;
  location?: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateAttendanceRequest = {
  emp_id: number;
  att_date: string;
  check_in: string;
  check_out?: string;
  // status: AttendanceStatus;
};

export type AttendanceExportRow = {
  employee: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  hours: string;
  status: string;
  location: string;
};
