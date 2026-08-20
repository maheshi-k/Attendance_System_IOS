export type EmployeeStatus = "Active" | "On Leave" | "Probation";

export type EmployeeRecord = {
  emp_id: number;
  emp_code: string;
  first_name: string;
  last_name: string;
  email: string;
  role_id: number;
  role_name: string;
  mobile_no?: string;
  profile_photo?: string;
  employment_status: EmployeeStatus;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
