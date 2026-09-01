import sql from "mssql";

export const getEmployeeLeaveBalances = async (emp_id, leave_year) => {
  const request = new sql.Request();

  request.input("emp_id", sql.Int, emp_id);
  request.input("leave_year", sql.Int, leave_year);

  const result = await request.query(`
    SELECT
      b.leave_balance_id,
      b.emp_id,
      b.leave_type_id,
      lt.leave_type_name,
      lt.is_paid,
      lt.max_days,
      lt.carry_forward,
      lt.carry_forward_days AS max_carry_forward_days,
      b.leave_year,
      b.allocated_days,
      b.carried_forward_days,
      b.used_days,
      (
        b.allocated_days
        + b.carried_forward_days
        - b.used_days
      ) AS available_days,
      b.created_at,
      b.updated_at
    FROM LEAVE_EmployeeBalance b
    INNER JOIN LEAVE_LeaveType lt
      ON b.leave_type_id = lt.leave_type_id
    WHERE b.emp_id = @emp_id
      AND b.leave_year = @leave_year
      AND lt.is_active = 1
    ORDER BY lt.leave_type_id;
  `);

  return result.recordset;
};

export const updateLeaveBalanceOnApproval = async (
  emp_id,
  leave_type_id,
  start_date,
  total_days
) => {
  const request = new sql.Request();

  // Extract the year from start_date
  const leaveYear = new Date(start_date).getFullYear();

  request.input("emp_id", sql.Int, emp_id);
  request.input("leave_type_id", sql.Int, leave_type_id);
  request.input("leave_year", sql.Int, leaveYear);
  request.input("total_days", sql.Decimal(5, 2), total_days);

  const result = await request.query(`
    UPDATE LEAVE_EmployeeBalance
    SET
      used_days = ISNULL(used_days, 0) + @total_days,
      updated_at = GETDATE()
    WHERE
      emp_id = @emp_id
      AND leave_type_id = @leave_type_id
      AND leave_year = @leave_year
  `);

  if (result.rowsAffected[0] === 0) {
    throw new Error(
      `No leave balance record found for employee ${emp_id}, leave type ${leave_type_id}, and year ${leaveYear}`
    );
  }

  return result;
};