export type EmployeeAttendanceRecord = {
  att_id: number;
  emp_id: number;
  att_date: string;
  check_in: string | null;
  check_out: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type SelfAttendance = {
  today: EmployeeAttendanceRecord | null;
  records: EmployeeAttendanceRecord[];
  stats: {
    present_days: number;
    late_days: number;
    absent_days: number;
  };
};
