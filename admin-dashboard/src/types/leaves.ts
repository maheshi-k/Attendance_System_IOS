export type LeaveRequest = {
  leave_request_id: number;
  emp_id: number;
  leave_type_id: number;
  leave_type_name: string;
  start_date: string;
  end_date: string;
  total_days: number;
  reason?: string | null;
  status: string;
  action_by?: number | null;
  action_by_first_name?: string | null;
  action_by_last_name?: string | null;
  action_at?: string | null;
  comment?: string | null;
  created_at: string;
  updated_at: string;
};

export type LeaveType = {
  leave_type_id: number;
  leave_type_name: string;
  description?: string | null;
  max_days: number;
  is_paid: boolean;
  is_active: boolean;
};

export type SupervisedEmployee = {
  emp_id: number;
  emp_code: string;
  first_name: string;
  last_name: string;
  email_1: string;
  designation?: string;
  profile_photo?: {
    type: string;
    data: number[];
  } | null;
};
