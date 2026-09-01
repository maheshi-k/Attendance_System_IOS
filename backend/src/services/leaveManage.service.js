import sql from "mssql";

export const getLeaveHistoryByEmpID = async (user) => {
  const request = new sql.Request();

  request.input("emp_id", sql.Int, user.emp_id);

  const result = await request.query(`
    SELECT
      lr.leave_request_id,
      lr.emp_id,
      lr.leave_type_id,
      lt.leave_type_name,
      lr.start_date,
      lr.end_date,
      lr.total_days,
      lr.reason,
      lr.status,
      lr.action_by,
      approver.first_name AS action_by_first_name,
      approver.last_name AS action_by_last_name,
      lr.action_at,
      lr.comment,
      lr.created_at,
      lr.updated_at
    FROM LEAVE_Request lr

    INNER JOIN LEAVE_LeaveType lt
      ON lr.leave_type_id = lt.leave_type_id

    LEFT JOIN EMP_Emp approver
      ON lr.action_by = approver.emp_id

    WHERE lr.emp_id = @emp_id

    ORDER BY lr.created_at DESC;
  `);

  return result.recordset;
};