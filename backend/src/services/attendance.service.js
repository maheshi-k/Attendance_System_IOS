import sql from "mssql";
import { ATTENDANCE_CONFIG } from "../config/attendance.config.js";

const profilePhotoDataUrl = (photo) => {
  if (!photo) return null;

  const buffer = Buffer.isBuffer(photo)
    ? photo
    : Buffer.from(photo.data || photo);
  const isPng = buffer.subarray(0, 8).equals(
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  );
  const isWebp =
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP";
  const mimeType = isPng ? "image/png" : isWebp ? "image/webp" : "image/jpeg";

  return `data:${mimeType};base64,${buffer.toString("base64")}`;
};

export const markAttendance = async (emp_id, qr_token) => {
  const {
  WORK_START_TIME,
  GRACE_PERIOD_MINUTES,
  MIN_CHECKOUT_HOURS,
} = ATTENDANCE_CONFIG;

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
      WHEN CAST(GETDATE() AS TIME) >
           DATEADD(
             MINUTE,
             ${GRACE_PERIOD_MINUTES},
             CAST(${WORK_START_TIME} AS TIME)
           )
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
        e.designation,
        e.email_1 AS email,
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
        e.designation,
        e.email_1 AS email,
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

  return result.recordset.map((record) => ({
    ...record,
    profile_photo: profilePhotoDataUrl(record.profile_photo),
  }));
};

export const getSelfAttendance = async (emp_id) => {
  const request = new sql.Request();
  request.input("emp_id", sql.Int, emp_id);

  const result = await request.query(`
    SELECT TOP 5
      a.att_id,
      a.emp_id,
      a.att_date,
      CONVERT(varchar(8), a.check_in, 108) AS check_in,
      CONVERT(varchar(8), a.check_out, 108) AS check_out,
      a.status,
      a.created_at,
      a.updated_at
    FROM ATT_Attendance a
    WHERE a.emp_id = @emp_id
    ORDER BY a.att_date DESC, a.check_in DESC;

    SELECT
      SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS present_days,
      SUM(CASE WHEN a.status = 'Late' THEN 1 ELSE 0 END) AS late_days,
      SUM(CASE WHEN a.status = 'Absent' THEN 1 ELSE 0 END) AS absent_days
    FROM ATT_Attendance a
    WHERE a.emp_id = @emp_id
      AND a.att_date >= DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1)
      AND a.att_date < DATEADD(
        MONTH,
        1,
        DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1)
      );
  `);

  const records = result.recordset;
  const counts = result.recordsets[1][0] ?? {};
  const today = records.find(
    (record) =>
      new Date(record.att_date).toISOString().slice(0, 10) ===
      new Date().toISOString().slice(0, 10),
  ) ?? null;

  return {
    today,
    records,
    stats: {
      present_days: Number(counts.present_days ?? 0),
      late_days: Number(counts.late_days ?? 0),
      absent_days: Number(counts.absent_days ?? 0),
    },
  };
};

export const addManualAttendance = async ({
  emp_id,
  att_date,
  check_in,
  check_out,
  status,
}) => {
  const request = new sql.Request();
  request.input("emp_id", sql.Int, emp_id);
  request.input("att_date", sql.Date, att_date);
  request.input("check_in", sql.VarChar(8), check_in);
  request.input("check_out", sql.VarChar(8), check_out || null);
  request.input("status", sql.VarChar(20), status);

  const result = await request.query(`
    INSERT INTO ATT_Attendance (
      emp_id,
      att_date,
      check_in,
      check_out,
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
      @emp_id,
      @att_date,
      CONVERT(TIME, @check_in),
      CONVERT(TIME, @check_out),
      @status
    )
  `);

  return result.recordset[0];
};

export const getAttendanceByID = async (att_id) => {
  const request = new sql.Request();
  request.input("att_id", sql.Int, att_id);

  const result = await request.query(`
    SELECT
      a.att_id,
      a.emp_id,
      e.emp_code,
      e.first_name,
      e.last_name,
      e.designation,
      e.email_1 AS email,
      e.profile_photo,
      a.att_date,
      CONVERT(varchar(8), a.check_in, 108) AS check_in,
      CONVERT(varchar(8), a.check_out, 108) AS check_out,
      a.status,
      a.created_at,
      a.updated_at
    FROM ATT_Attendance a
    INNER JOIN EMP_Emp e ON a.emp_id = e.emp_id
    WHERE a.att_id = @att_id
  `);

  const attendance = result.recordset[0];
  return attendance
    ? {
        ...attendance,
        profile_photo: profilePhotoDataUrl(attendance.profile_photo),
      }
    : null;
};

export const updateManualAttendance = async ({
  att_id,
  emp_id,
  att_date,
  check_in,
  check_out,
  status,
}) => {
  const request = new sql.Request();
  request.input("att_id", sql.Int, att_id);
  request.input("emp_id", sql.Int, emp_id);
  request.input("att_date", sql.Date, att_date);
  request.input("check_in", sql.VarChar(8), check_in);
  request.input("check_out", sql.VarChar(8), check_out || null);
  request.input("status", sql.VarChar(20), status);

  const result = await request.query(`
    UPDATE ATT_Attendance
    SET
      emp_id = @emp_id,
      att_date = @att_date,
      check_in = CONVERT(TIME, @check_in),
      check_out = CONVERT(TIME, @check_out),
      status = @status,
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
    WHERE att_id = @att_id
  `);

  return result.recordset[0] || null;
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
        e.designation,
        e.email_1 AS email,
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
        e.designation,
        e.email_1 AS email,
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

  return result.recordset.map((record) => ({
    ...record,
    profile_photo: profilePhotoDataUrl(record.profile_photo),
  }));
};

