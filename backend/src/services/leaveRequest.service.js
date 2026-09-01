import sql from "mssql";

export const getAllLeaveRequests = async (user) => {
  const request = new sql.Request();

  request.input("emp_id", sql.Int, user.emp_id);
  request.input("role_id", sql.Int, user.role_id);

  const result = await request.query(`
    SELECT
      lr.leave_request_id,
      lr.emp_id,
      e.emp_code,
      e.first_name,
      e.last_name,

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

    INNER JOIN EMP_Emp e
      ON lr.emp_id = e.emp_id

    INNER JOIN LEAVE_LeaveType lt
      ON lr.leave_type_id = lt.leave_type_id

    LEFT JOIN EMP_Emp approver
      ON lr.action_by = approver.emp_id

    WHERE
      (
        @role_id = 1
        OR
        lr.emp_id = @emp_id
        OR
        (
          @role_id = 2
          AND e.supervisor_id = @emp_id
        )
      )

    ORDER BY lr.created_at DESC;
  `);

  return result.recordset;
};

export const getLeaveRequestByID = async (leave_request_id, user) => {
  const request = new sql.Request();

  request.input("leave_request_id", sql.Int, leave_request_id);
  request.input("emp_id", sql.Int, user.emp_id);
  request.input("role_id", sql.Int, user.role_id);

  const result = await request.query(`
    SELECT
      lr.leave_request_id,
      lr.emp_id,
      e.emp_code,
      e.first_name,
      e.last_name,

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

    INNER JOIN EMP_Emp e
      ON lr.emp_id = e.emp_id

    INNER JOIN LEAVE_LeaveType lt
      ON lr.leave_type_id = lt.leave_type_id

    LEFT JOIN EMP_Emp approver
      ON lr.action_by = approver.emp_id

    WHERE
      lr.leave_request_id = @leave_request_id
      AND
      (
        @role_id = 1
        OR
        lr.emp_id = @emp_id
        OR
        (
          @role_id = 2
          AND e.supervisor_id = @emp_id
        )
      );
  `);

  return result.recordset[0] || null;
};

export const createLeaveRequest = async (leaveData, user) => {
  const {
    leave_type_id,
    start_date,
    end_date,
    reason,
  } = leaveData;

  const emp_id = Number(user.emp_id);

  if (!emp_id) {
    throw new Error("Invalid logged-in employee");
  }

  const request = new sql.Request();

  request.input("emp_id", sql.Int, emp_id);
  request.input("leave_type_id", sql.Int, leave_type_id);
  request.input("start_date", sql.Date, start_date);
  request.input("end_date", sql.Date, end_date);
  request.input("reason", sql.VarChar(500), reason || null);

  // Calculate total leave days.
  const result = await request.query(`
    SELECT
      DATEDIFF(DAY, @start_date, @end_date) + 1 AS total_days
  `);

  const totalDays = result.recordset[0].total_days;

  // Get leave type information.
  const leaveTypeRequest = new sql.Request();

  leaveTypeRequest.input("leave_type_id", sql.Int, leave_type_id);

  const leaveTypeResult = await leaveTypeRequest.query(`
    SELECT
      leave_type_id,
      leave_type_name,
      max_days,
      is_paid,
      carry_forward,
      carry_forward_days,
      is_active
    FROM LEAVE_LeaveType
    WHERE leave_type_id = @leave_type_id
  `);

  if (leaveTypeResult.recordset.length === 0) {
    throw new Error("Leave type not found");
  }

  const leaveType = leaveTypeResult.recordset[0];

  if (!leaveType.is_active) {
    throw new Error("Leave type is inactive");
  }

  // Check maximum days allowed for this leave type.
  if (totalDays > Number(leaveType.max_days)) {
    throw new Error(
      `Maximum ${leaveType.max_days} days are allowed for ${leaveType.leave_type_name}`
    );
  }

  // Verify employee exists and is active.
  const employeeRequest = new sql.Request();

  employeeRequest.input("emp_id", sql.Int, emp_id);

  const employeeResult = await employeeRequest.query(`
    SELECT
      emp_id,
      supervisor_id,
      is_active
    FROM EMP_Emp
    WHERE emp_id = @emp_id
  `);

  if (employeeResult.recordset.length === 0) {
    throw new Error("Employee not found");
  }

  const employee = employeeResult.recordset[0];

  if (!employee.is_active) {
    throw new Error("Employee account is inactive");
  }

  const insertRequest = new sql.Request();

  insertRequest.input("emp_id", sql.Int, emp_id);
  insertRequest.input("leave_type_id", sql.Int, leave_type_id);
  insertRequest.input("start_date", sql.Date, start_date);
  insertRequest.input("end_date", sql.Date, end_date);
  insertRequest.input("total_days", sql.Decimal(5, 2), totalDays);
  insertRequest.input("reason", sql.VarChar(500), reason || null);

  const insertResult = await insertRequest.query(`
    INSERT INTO LEAVE_Request (
      emp_id,
      leave_type_id,
      start_date,
      end_date,
      total_days,
      reason
    )
    OUTPUT
      INSERTED.leave_request_id,
      INSERTED.emp_id,
      INSERTED.leave_type_id,
      INSERTED.start_date,
      INSERTED.end_date,
      INSERTED.total_days,
      INSERTED.reason,
      INSERTED.status,
      INSERTED.action_by,
      INSERTED.action_at,
      INSERTED.comment,
      INSERTED.created_at,
      INSERTED.updated_at

    VALUES (
      @emp_id,
      @leave_type_id,
      @start_date,
      @end_date,
      @total_days,
      @reason
    )
  `);

  const leaveRequest = insertResult.recordset[0];

  // Record submission in history.
  const historyRequest = new sql.Request();

  historyRequest.input(
    "leave_request_id",
    sql.Int,
    leaveRequest.leave_request_id
  );

  historyRequest.input("action_by", sql.Int, user.emp_id);

  historyRequest.input(
    "comments",
    sql.VarChar(500),
    reason || null
  );

  await historyRequest.query(`
    INSERT INTO LEAVE_RequestHistory (
      leave_request_id,
      action,
      action_by,
      comments
    )
    VALUES (
      @leave_request_id,
      'Submitted',
      @action_by,
      @comments
    )
  `);

  return leaveRequest;
};

export const approveLeaveRequest = async (leave_request_id, user) => {
  const request = new sql.Request();

  request.input("leave_request_id", sql.Int, leave_request_id);
  request.input("approver_id", sql.Int, user.emp_id);
  request.input("role_id", sql.Int, user.role_id);

  if (Number(user.role_id) !== 1 && Number(user.role_id) !== 2) {
    throw new Error("You do not have permission to approve leave requests");
  }

  const result = await request.query(`
    SELECT
      lr.leave_request_id,
      lr.emp_id,
      lr.status,
      e.supervisor_id
    FROM LEAVE_Request lr
    INNER JOIN EMP_Emp e
      ON lr.emp_id = e.emp_id
    WHERE lr.leave_request_id = @leave_request_id
  `);

  if (result.recordset.length === 0) {
    throw new Error("Leave request not found");
  }

  const leaveRequest = result.recordset[0];

  // Only Pending requests can be approved.
  if (leaveRequest.status !== "Pending") {
    throw new Error(
      `Leave request cannot be approved because it is already ${leaveRequest.status}`
    );
  }

  // Supervisor can only approve leave for their own employees.
  if (![1, 2].includes(Number(user.role_id))) {
    throw new Error(
      "Only Admin or Supervisor can approve leave requests"
    );
  }

  if (
    Number(user.role_id) === 2 &&
    Number(leaveRequest.supervisor_id) !== Number(user.emp_id)
  ) {
    throw new Error(
      "You can only approve leave requests for employees assigned to you"
    );
  }

  // Use transaction for data consistency
  const transaction = new sql.Transaction();

  try {
    await transaction.begin();

    const updateRequest = new sql.Request(transaction);

    updateRequest.input("leave_request_id", sql.Int, leave_request_id);
    updateRequest.input("action_by", sql.Int, user.emp_id);

    const updateResult = await updateRequest.query(`
      UPDATE LEAVE_Request
      SET
        status = 'Approved',
        action_by = @action_by,
        action_at = GETDATE(),
        comment = NULL,
        updated_at = GETDATE()
      OUTPUT
        INSERTED.leave_request_id,
        INSERTED.emp_id,
        INSERTED.leave_type_id,
        INSERTED.start_date,
        INSERTED.end_date,
        INSERTED.total_days,
        INSERTED.reason,
        INSERTED.status,
        INSERTED.action_by,
        INSERTED.action_at,
        INSERTED.comment,
        INSERTED.created_at,
        INSERTED.updated_at
      WHERE leave_request_id = @leave_request_id
    `);

    const approvedLeave = updateResult.recordset[0];

    // Record approval in history within same transaction
    const historyRequest = new sql.Request(transaction);

    historyRequest.input(
      "leave_request_id",
      sql.Int,
      leave_request_id
    );

    historyRequest.input(
      "action",
      sql.VarChar(20),
      "Approved"
    );

    historyRequest.input(
      "action_by",
      sql.Int,
      user.emp_id
    );

    historyRequest.input(
      "comments",
      sql.VarChar(500),
      "Leave request approved"
    );

    await historyRequest.query(`
      INSERT INTO LEAVE_RequestHistory (
        leave_request_id,
        action,
        action_by,
        comments
      )
      VALUES (
        @leave_request_id,
        @action,
        @action_by,
        @comments
      )
    `);

    // Update leave balance within same transaction
    const leaveYear = new Date(approvedLeave.start_date).getFullYear();

    const balanceRequest = new sql.Request(transaction);

    balanceRequest.input("emp_id", sql.Int, approvedLeave.emp_id);
    balanceRequest.input("leave_type_id", sql.Int, approvedLeave.leave_type_id);
    balanceRequest.input("leave_year", sql.Int, leaveYear);
    balanceRequest.input("total_days", sql.Decimal(5, 2), approvedLeave.total_days);

    const balanceResult = await balanceRequest.query(`
      UPDATE LEAVE_EmployeeBalance
      SET
        used_days = ISNULL(used_days, 0) + @total_days,
        updated_at = GETDATE()
      WHERE
        emp_id = @emp_id
        AND leave_type_id = @leave_type_id
        AND leave_year = @leave_year
    `);

    if (balanceResult.rowsAffected[0] === 0) {
      throw new Error(
        `No leave balance record found for employee ${approvedLeave.emp_id}, leave type ${approvedLeave.leave_type_id}, and year ${leaveYear}`
      );
    }

    await transaction.commit();

    return approvedLeave;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const rejectLeaveRequest = async (
  leave_request_id,
  comment,
  user
) => {
  if (Number(user.role_id) !== 1 && Number(user.role_id) !== 2) {
    throw new Error("You do not have permission to reject leave requests");
  }

  const request = new sql.Request();

  request.input("leave_request_id", sql.Int, leave_request_id);
  request.input("approver_id", sql.Int, user.emp_id);

  const result = await request.query(`
    SELECT
      lr.leave_request_id,
      lr.emp_id,
      lr.status,
      e.supervisor_id
    FROM LEAVE_Request lr
    INNER JOIN EMP_Emp e
      ON lr.emp_id = e.emp_id
    WHERE lr.leave_request_id = @leave_request_id
  `);

  if (result.recordset.length === 0) {
    throw new Error("Leave request not found");
  }

  const leaveRequest = result.recordset[0];

  // Only Pending requests can be rejected.
  if (leaveRequest.status !== "Pending") {
    throw new Error(
      `Leave request cannot be rejected because it is already ${leaveRequest.status}`
    );
  }

  // Supervisor can only reject leave for their own employees.
  if (![1, 2].includes(Number(user.role_id))) {
    throw new Error(
      "Only Admin or Supervisor can reject leave requests"
    );
  }

    if (
      Number(user.role_id) === 2 &&
      Number(leaveRequest.supervisor_id) !== Number(user.emp_id)
    ) {
      throw new Error(
        "You can only reject leave requests for employees assigned to you"
      );
    }

  // Use transaction for data consistency
  const transaction = new sql.Transaction();

  try {
    await transaction.begin();

    const updateRequest = new sql.Request(transaction);

    updateRequest.input("leave_request_id", sql.Int, leave_request_id);
    updateRequest.input(
      "comment",
      sql.VarChar(500),
      comment
    );

    const updateResult = await updateRequest.query(`
      UPDATE LEAVE_Request
      SET
        status = 'Rejected',
        action_by = NULL,
        action_at = NULL,
        comment = @comment,
        updated_at = GETDATE()
      OUTPUT
        INSERTED.leave_request_id,
        INSERTED.emp_id,
        INSERTED.leave_type_id,
        INSERTED.start_date,
        INSERTED.end_date,
        INSERTED.total_days,
        INSERTED.reason,
        INSERTED.status,
        INSERTED.action_by,
        INSERTED.action_at,
        INSERTED.comment,
        INSERTED.created_at,
        INSERTED.updated_at
      WHERE leave_request_id = @leave_request_id
    `);

    const rejectedLeave = updateResult.recordset[0];

    // Record rejection in history within same transaction
    const historyRequest = new sql.Request(transaction);

    historyRequest.input(
      "leave_request_id",
      sql.Int,
      leave_request_id
    );

    historyRequest.input(
      "action",
      sql.VarChar(20),
      "Rejected"
    );

    historyRequest.input(
      "action_by",
      sql.Int,
      user.emp_id
    );

    historyRequest.input(
      "comments",
      sql.VarChar(500),
      comment
    );

    await historyRequest.query(`
      INSERT INTO LEAVE_RequestHistory (
        leave_request_id,
        action,
        action_by,
        comments
      )
      VALUES (
        @leave_request_id,
        @action,
        @action_by,
        @comments
      )
    `);

    await transaction.commit();

    return rejectedLeave;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const getSupervisedEmployees = async (user) => {
  const request = new sql.Request();

  request.input("supervisor_id", sql.Int, user.emp_id);

  const result = await request.query(`
    SELECT
      e.emp_id,
      e.emp_code,
      e.first_name,
      e.last_name,
      e.email_1,
      e.designation,
      e.profile_photo
    FROM EMP_Emp e
    WHERE e.supervisor_id = @supervisor_id
      AND e.is_active = 1
    ORDER BY e.first_name, e.last_name;  
  `);

  return result.recordset;
}

