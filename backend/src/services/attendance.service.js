import sql from "mssql";

const MIN_CHECKOUT_HOURS = 4;

export const markAttendance = async (emp_id, qr_token) => {
  // 1. Check employee
  const employeeResult = await sql.query`
    SELECT emp_id, is_active
    FROM EMP_Emp
    WHERE emp_id = ${emp_id}
  `;

  const employee = employeeResult.recordset[0];

  if (!employee) {
    throw new Error("EMPLOYEE_NOT_FOUND");
  }

  if (!employee.is_active) {
    throw new Error("EMPLOYEE_INACTIVE");
  }

  // 2. Check QR token
  const qrResult = await sql.query`
    SELECT qr_id, qr_token, is_active
    FROM ATT_QR
    WHERE qr_token = ${qr_token}
  `;

  const qr = qrResult.recordset[0];

  if (!qr) {
    throw new Error("INVALID_QR");
  }

  if (!qr.is_active) {
    throw new Error("QR_INACTIVE");
  }

  // 3. Check today's attendance
  const todayResult = await sql.query`
    SELECT
      att_id,
      emp_id,
      att_date,
      check_in,
      check_out,
      status
    FROM ATT_Attendance
    WHERE emp_id = ${emp_id}
      AND att_date = CAST(GETDATE() AS DATE)
  `;

  const attendance = todayResult.recordset[0];

  // 4. First scan → Check In
  if (!attendance) {
    const result = await sql.query`
      INSERT INTO ATT_Attendance (
        emp_id,
        att_date,
        check_in,
        status
      )
      OUTPUT
        INSERTED.att_id,
        INSERTED.emp_id,
        INSERTED.att_date,
        INSERTED.check_in,
        INSERTED.check_out,
        INSERTED.status,
        INSERTED.created_at,
        INSERTED.updated_at
      VALUES (
        ${emp_id},
        CAST(GETDATE() AS DATE),
        CAST(GETDATE() AS TIME),
        CASE
          WHEN CAST(GETDATE() AS TIME) > '09:00:00'
          THEN 'Late'
          ELSE 'Present'
        END
      )
    `;

    return {
      action: "CHECK_IN",
      attendance: result.recordset[0],
    };
  }

  // 5. Already checked out
  if (attendance.check_out) {
    throw new Error("ATTENDANCE_COMPLETED");
  }

  // 6. Check minimum 4-hour requirement
const timeResult = await sql.query`
  SELECT DATEDIFF(
    MINUTE,
    check_in,
    CAST(GETDATE() AS TIME)
  ) AS minutes_elapsed
  FROM ATT_Attendance
  WHERE att_id = ${attendance.att_id}
`;

const minutesElapsed = timeResult.recordset[0].minutes_elapsed;

console.log("Minutes since check-in:", minutesElapsed);

if (minutesElapsed < MIN_CHECKOUT_HOURS * 60) {
  throw new Error("MIN_CHECKOUT_TIME");
}

  // 7. Second valid scan → Check Out
  const result = await sql.query`
    UPDATE ATT_Attendance
    SET
      check_out = CAST(GETDATE() AS TIME),
      updated_at = GETDATE()
    OUTPUT
      INSERTED.att_id,
      INSERTED.emp_id,
      INSERTED.att_date,
      INSERTED.check_in,
      INSERTED.check_out,
      INSERTED.status,
      INSERTED.created_at,
      INSERTED.updated_at
    WHERE att_id = ${attendance.att_id}
  `;

  return {
    action: "CHECK_OUT",
    attendance: result.recordset[0],
  };
};

export const getAllAttendance = async (date) => {
  let result;

  if (date) {
    result = await sql.query`
      SELECT
        a.att_id,
        a.emp_id,
        e.emp_code,
        e.first_name,
        e.last_name,
        e.email,
        e.profile_photo,
        a.att_date,
        CONVERT(varchar(8), a.check_in, 108) AS check_in,
        CONVERT(varchar(8), a.check_out, 108) AS check_out,
        a.status,
        a.created_at,
        a.updated_at
      FROM ATT_Attendance a
      INNER JOIN EMP_Emp e
        ON a.emp_id = e.emp_id
      WHERE a.att_date = ${date}
      ORDER BY
        a.att_date DESC,
        a.check_in DESC
    `;
  } else {
    result = await sql.query`
      SELECT
        a.att_id,
        a.emp_id,
        e.emp_code,
        e.first_name,
        e.last_name,
        e.email,
        e.profile_photo,
        a.att_date,
        CONVERT(varchar(8), a.check_in, 108) AS check_in,
        CONVERT(varchar(8), a.check_out, 108) AS check_out,
        a.status,
        a.created_at,
        a.updated_at
      FROM ATT_Attendance a
      INNER JOIN EMP_Emp e
        ON a.emp_id = e.emp_id
      ORDER BY
        a.att_date DESC,
        a.check_in DESC
    `;
  }

  return result.recordset;
};

export const getAttendanceByEmpID = async(emp_id, date) => {
 let result;

  if (date) {
    result = await sql.query`
      SELECT
        a.att_id,
        a.emp_id,
        e.emp_code,
        e.first_name,
        e.last_name,
        e.email,
        e.profile_photo,
        a.att_date,
        CONVERT(varchar(8), a.check_in, 108) AS check_in,
        CONVERT(varchar(8), a.check_out, 108) AS check_out,
        a.status,
        a.created_at,
        a.updated_at
      FROM ATT_Attendance a
      INNER JOIN EMP_Emp e
        ON a.emp_id = e.emp_id
      WHERE
        a.emp_id = ${emp_id}
        AND a.att_date = ${date}
      ORDER BY
        a.att_date DESC,
        a.check_in DESC
    `;
  } else {
    result = await sql.query`
      SELECT
        a.att_id,
        a.emp_id,
        e.emp_code,
        e.first_name,
        e.last_name,
        e.email,
        e.profile_photo,
        a.att_date,
        CONVERT(varchar(8), a.check_in, 108) AS check_in,
        CONVERT(varchar(8), a.check_out, 108) AS check_out,
        a.status,
        a.created_at,
        a.updated_at
      FROM ATT_Attendance a
      INNER JOIN EMP_Emp e
        ON a.emp_id = e.emp_id
      WHERE a.emp_id = ${emp_id}
      ORDER BY
        a.att_date DESC,
        a.check_in DESC
    `;
  }

  return result.recordset;
};

