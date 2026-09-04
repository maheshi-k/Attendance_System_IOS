export type EmployeeStatus = "Active" | "On Leave" | "Probation";

export type EmployeeRecord = {
  emp_id: number;
  emp_code: string;
  first_name: string;
  last_name: string;

  email_1: string;
  email_2?: string | null;

  role_id: number;
  role_name: string;
  role_description?: string;
  supervisor_id?: number | null;

  mobile_no_1: string;
  mobile_no_2?: string | null;

  profile_photo?: string | null;

  designation?: string;

  nic: string;
  gender: string;
  address?: string | null;
  joining_date: string;

  employment_status: EmployeeStatus;

  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateEmployeeRequest = {
  emp_code: string;
  first_name: string;
  last_name: string;
  email_1: string;
  email_2?: string;
  password: string;
  nic: string;
  gender: string;
  address?: string;
  role_id: number;
  supervisor_id?: number | null;
  profile_photo?: string | null;
  employment_status: EmployeeStatus;
  mobile_no_1: string;
  mobile_no_2?: string;
  joining_date: string;
  designation: string;
  is_active: boolean;
};

export type DesignationHistory = {
  designation_history_id?: number;
  emp_id?: number;
  designation: string;
  effective_from: string;
  effective_to: string | null;
  created_at?: string;
  updated_at?: string;
};

export type EmployeeExportRow = {
  employeeId: string;
  firstName: string;
  lastName: string;
  email1: string;
  email2: string;
  mobile1: string;
  mobile2: string;
  nic: string;
  gender: string;
  address: string;
  role: string;
  designation: string;
  employmentStatus: string;
  joiningDate: string;
  accountStatus: string;
  profilePhoto: string;
  createdAt: string;
  updatedAt: string;
};
