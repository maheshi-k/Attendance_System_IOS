import sql from "mssql";
import bcrypt from "bcryptjs";

const profilePhotoDataUrl = (photo) => {
  if (!photo) {
    return null;
  }

  const buffer = Buffer.isBuffer(photo)
    ? photo
    : Buffer.from(photo.data || photo);
  let mimeType = "image/jpeg";

  if (buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    mimeType = "image/png";
  } else if (buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP") {
    mimeType = "image/webp";
  }

  return `data:${mimeType};base64,${buffer.toString("base64")}`;
};

export const getAllEmployees = async () => {
  const result = await sql.query(`
    SELECT
      e.emp_id,
      e.emp_code,
      e.first_name,
      e.last_name,
      e.email_1,
      e.role_id,
      r.role_name,
      e.profile_photo,
      e.employment_status,
      e.mobile_no_1,
      e.mobile_no_2,
      e.nic,
      e.designation,
      e.email_2,
      e.gender,
      e.address,
      e.joining_date,
      e.is_active,
      e.created_at,
      e.updated_at
    FROM EMP_Emp e
    LEFT JOIN ROLE_Role r
      ON e.role_id = r.role_id
    WHERE e.is_active = 1
    ORDER BY e.emp_id DESC;
  `);

  return result.recordset.map((employee) => ({
    ...employee,
    profile_photo: profilePhotoDataUrl(employee.profile_photo),
  }));
};

export const createEmployee = async (employeeData) => {
  const {
    emp_code,
    first_name,
    last_name,
    email_1,
    email_2,
    password,
    nic,
    gender,
    address,
    role_id,
    profile_photo,
    employment_status,
    mobile_no_1,
    mobile_no_2,
    joining_date,
    designation,
    is_present,
    effective_to,
    designation_history,
  } = employeeData;

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Create a request so we can explicitly define
  // profile_photo as VARBINARY(MAX)
  const request = new sql.Request();

  request.input("emp_code", sql.VarChar(20), emp_code);
  request.input("first_name", sql.VarChar(50), first_name);
  request.input("last_name", sql.VarChar(50), last_name);
  request.input("email_1", sql.VarChar(100), email_1);
  request.input("email_2", sql.VarChar(100), email_2 || null);
  request.input("password_hash", sql.VarChar(255), passwordHash);
  request.input("nic", sql.VarChar(20), nic);
  request.input("gender", sql.VarChar(20), gender);
  request.input("address", sql.VarChar(255), address || null);
  request.input("role_id", sql.Int, role_id);

  // IMPORTANT: Store actual image bytes
  request.input(
    "profile_photo",
    sql.VarBinary(sql.MAX),
    profile_photo || null
  );

  request.input(
    "employment_status",
    sql.VarChar(30),
    employment_status || "Active"
  );

  request.input("mobile_no_1", sql.VarChar(20), mobile_no_1);
  request.input("mobile_no_2", sql.VarChar(20), mobile_no_2 || null);
  request.input("joining_date", sql.Date, joining_date);
  request.input("designation", sql.VarChar(100), designation);

  // 1. Create employee
  const result = await request.query(`
    INSERT INTO EMP_Emp (
      emp_code,
      first_name,
      last_name,
      email_1,
      email_2,
      password_hash,
      nic,
      gender,
      address,
      role_id,
      profile_photo,
      employment_status,
      mobile_no_1,
      mobile_no_2,
      joining_date,
      designation
    )
    OUTPUT
      INSERTED.emp_id,
      INSERTED.emp_code,
      INSERTED.first_name,
      INSERTED.last_name,
      INSERTED.email_1,
      INSERTED.email_2,
      INSERTED.nic,
      INSERTED.gender,
      INSERTED.address,
      INSERTED.role_id,
      INSERTED.profile_photo,
      INSERTED.employment_status,
      INSERTED.mobile_no_1,
      INSERTED.mobile_no_2,
      INSERTED.joining_date,
      INSERTED.designation,
      INSERTED.is_active,
      INSERTED.created_at,
      INSERTED.updated_at
    VALUES (
      @emp_code,
      @first_name,
      @last_name,
      @email_1,
      @email_2,
      @password_hash,
      @nic,
      @gender,
      @address,
      @role_id,
      @profile_photo,
      @employment_status,
      @mobile_no_1,
      @mobile_no_2,
      @joining_date,
      @designation
    )
  `);

  const employee = result.recordset[0];

  // 2. Add initial designation to designation history
  const histories = designation_history?.length
    ? designation_history
    : [{ designation, effective_from: joining_date, is_present, effective_to }];

  for (const history of histories) {
    const historyRequest = new sql.Request();
    historyRequest.input("emp_id", sql.Int, employee.emp_id);
    historyRequest.input("designation", sql.VarChar(100), history.designation);
    historyRequest.input("effective_from", sql.Date, history.effective_from);
    historyRequest.input(
      "effective_to",
      sql.Date,
      history.is_present ? null : history.effective_to || new Date(),
    );
    await historyRequest.query(`
      INSERT INTO EMP_DesignationHistory (
        emp_id, designation, effective_from, effective_to
      )
      VALUES (@emp_id, @designation, @effective_from, @effective_to)
    `);
  }

  // 3. Return created employee
  return {
    ...employee,
    profile_photo: profilePhotoDataUrl(employee.profile_photo),
  };
};

export const getEmployeeByID = async(emp_id) => {
  const result = await sql.query(`SELECT * FROM EMP_Emp WHERE emp_id = ${emp_id} `);

  const employee = result.recordset[0];

  return employee
    ? {
        ...employee,
        profile_photo: profilePhotoDataUrl(employee.profile_photo),
      }
    : employee;
}

export const UpdateEmployeeByID = async (emp_id, employeeData) => {
  const {
    first_name,
    last_name,
    email_1,
    email_2,
    password,
    role_id,
    profile_photo,
    employment_status,
    mobile_no_1,
    mobile_no_2,
    nic,
    gender,
    address,
    joining_date,
    designation,
    is_present = true,
    effective_to,
    designation_history,
  } = employeeData;

  const passwordHash = password ? await bcrypt.hash(password, 10) : null;
  const request = new sql.Request();

  request.input("emp_id", sql.Int, emp_id);
  request.input("first_name", sql.VarChar(50), first_name);
  request.input("last_name", sql.VarChar(50), last_name);
  request.input("email_1", sql.VarChar(100), email_1);
  request.input("email_2", sql.VarChar(100), email_2 || null);
  request.input("password_hash", sql.VarChar(255), passwordHash);
  request.input("role_id", sql.Int, role_id);
  request.input("profile_photo", sql.VarBinary(sql.MAX), profile_photo || null);
  request.input("employment_status", sql.VarChar(30), employment_status);
  request.input("mobile_no_1", sql.VarChar(20), mobile_no_1);
  request.input("mobile_no_2", sql.VarChar(20), mobile_no_2 || null);
  request.input("designation", sql.VarChar(100), designation);
  request.input("nic", sql.VarChar(20), nic);
  request.input("gender", sql.VarChar(20), gender);
  request.input("address", sql.VarChar(255), address || null);
  request.input("joining_date", sql.Date, joining_date);

  const result = await request.query(`
    UPDATE EMP_Emp
    SET
      first_name = @first_name,
      last_name = @last_name,
      email_1 = @email_1,
      email_2 = @email_2,
      password_hash = COALESCE(@password_hash, password_hash),
      role_id = @role_id,
      profile_photo = COALESCE(@profile_photo, profile_photo),
      employment_status = @employment_status,
      mobile_no_1 = @mobile_no_1,
      mobile_no_2 = @mobile_no_2,
      designation = @designation,
      nic = @nic,
      gender = @gender,
      address = @address,
      joining_date = @joining_date,
      updated_at = GETDATE()
    OUTPUT
      INSERTED.emp_id,
      INSERTED.emp_code,
      INSERTED.first_name,
      INSERTED.last_name,
      INSERTED.email_1,
      INSERTED.email_2,
      INSERTED.role_id,
      INSERTED.profile_photo,
      INSERTED.employment_status,
      INSERTED.mobile_no_1,
      INSERTED.mobile_no_2,
      INSERTED.designation,
      INSERTED.nic,
      INSERTED.gender,
      INSERTED.address,
      INSERTED.joining_date,
      INSERTED.is_active,
      INSERTED.created_at,
      INSERTED.updated_at
    WHERE emp_id = @emp_id
  `);

  const currentHistory = await sql.query`
    SELECT TOP 1 designation_history_id
    FROM EMP_DesignationHistory
    WHERE emp_id = ${emp_id} AND designation = ${designation}
    ORDER BY effective_from DESC
  `;

  if (designation_history?.length) {
    const deleteHistoryRequest = new sql.Request();
    deleteHistoryRequest.input("emp_id", sql.Int, emp_id);
    await deleteHistoryRequest.query(`
      DELETE FROM EMP_DesignationHistory
      WHERE emp_id = @emp_id
    `);

    for (const history of designation_history) {
      const historyRequest = new sql.Request();
      historyRequest.input("emp_id", sql.Int, emp_id);
      historyRequest.input("designation", sql.VarChar(100), history.designation);
      historyRequest.input("effective_from", sql.Date, history.effective_from);
      historyRequest.input(
        "effective_to",
        sql.Date,
        history.is_present ? null : history.effective_to || new Date(),
      );
      await historyRequest.query(`
        INSERT INTO EMP_DesignationHistory (
          emp_id, designation, effective_from, effective_to
        )
        VALUES (@emp_id, @designation, @effective_from, @effective_to)
      `);
    }
  } else if (currentHistory.recordset[0]) {
    const historyRequest = new sql.Request();
    historyRequest.input(
      "designation_history_id",
      sql.Int,
      currentHistory.recordset[0].designation_history_id,
    );
    historyRequest.input(
      "effective_to",
      sql.Date,
      is_present ? null : effective_to || new Date(),
    );
    await historyRequest.query(`
      UPDATE EMP_DesignationHistory
      SET effective_to = @effective_to, updated_at = GETDATE()
      WHERE designation_history_id = @designation_history_id
    `);
  } else {
    const closeRequest = new sql.Request();
    closeRequest.input("emp_id", sql.Int, emp_id);
    await closeRequest.query(`
      UPDATE EMP_DesignationHistory
      SET effective_to = COALESCE(effective_to, CAST(GETDATE() AS DATE)),
          updated_at = GETDATE()
      WHERE emp_id = @emp_id AND effective_to IS NULL
    `);

    const historyRequest = new sql.Request();
    historyRequest.input("emp_id", sql.Int, emp_id);
    historyRequest.input("designation", sql.VarChar(100), designation);
    historyRequest.input("effective_from", sql.Date, joining_date);
    historyRequest.input(
      "effective_to",
      sql.Date,
      is_present ? null : effective_to || new Date(),
    );
    await historyRequest.query(`
      INSERT INTO EMP_DesignationHistory (
        emp_id, designation, effective_from, effective_to
      )
      VALUES (@emp_id, @designation, @effective_from, @effective_to)
    `);
  }

  const employee = result.recordset[0];

  return employee
    ? {
        ...employee,
        profile_photo: profilePhotoDataUrl(employee.profile_photo),
      }
    : employee;
};

export const updateEmployeeStatus = async (emp_id, is_active) => {
  const result = await sql.query`
    UPDATE EMP_Emp
    SET
      is_active = ${is_active},
      updated_at = GETDATE()
    OUTPUT
      INSERTED.emp_id,
      INSERTED.emp_code,
      INSERTED.first_name,
      INSERTED.last_name,
      INSERTED.email_1,
      INSERTED.email_2,
      INSERTED.role_id,
      INSERTED.profile_photo,
      INSERTED.employment_status,
      INSERTED.mobile_no_1,
      INSERTED.mobile_no_2,
      INSERTED.nic,
      INSERTED.gender,
      INSERTED.address,
      INSERTED.joining_date,
      INSERTED.designation,
      INSERTED.is_active,
      INSERTED.created_at,
      INSERTED.updated_at
    WHERE emp_id = ${emp_id}
  `;

  return result.recordset[0];
};

export const deleteEmployee = async (emp_id) => {
  const request = new sql.Request();
  request.input("emp_id", sql.Int, emp_id);

  const result = await request.query(`
    UPDATE EMP_Emp
    SET
      is_active = 0,
      updated_at = GETDATE()
    WHERE emp_id = @emp_id
  `);

  return result.rowsAffected[0] > 0;
};

export const getEmployeeByStatus = async (employment_status) => {
  const result = await sql.query(`
    SELECT * FROM EMP_Emp
    WHERE employment_status = '${employment_status}'
      AND is_active = 1
  `);
  return result.recordset;
}

export const getActiveEmployeeCount = async () => {
  const result = await sql.query(`
    SELECT COUNT(*) AS active_count
    FROM EMP_Emp
    WHERE is_active = 1
  `);

  return result.recordset[0].active_count;
};

export const getMyProfile = async (emp_id) => {
  const request = new sql.Request();

  request.input("emp_id", sql.Int, emp_id);

  try {
    const result = await request.query(`
      SELECT
        e.emp_id,
        e.emp_code,
        e.first_name,
        e.last_name,
        e.email_1,
        e.email_2,
        e.mobile_no_1,
        e.mobile_no_2,
        e.address,
        e.gender,
        e.nic,
        e.profile_photo,
        e.joining_date,
        e.employment_status,
        e.designation,
        e.role_id,
        r.role_name
      FROM EMP_Emp e
      LEFT JOIN ROLE_Role r
        ON e.role_id = r.role_id
      WHERE e.emp_id = @emp_id
    `);

    const employee = result.recordset[0];

    return employee
      ? {
          ...employee,
          profile_photo: profilePhotoDataUrl(employee.profile_photo),
        }
      : null;
  } catch (error) {
    console.error("Get my profile service error:", error);
    throw error;
  }
};

export const updateMyProfile = async (emp_id, profileData) => {
  const {
    first_name,
    last_name,
    email_2,
    mobile_no_1,
    mobile_no_2,
    address,
    gender,
    nic,
    profile_photo,
  } = profileData;
  const request = new sql.Request();

  request.input("emp_id", sql.Int, emp_id);
  request.input("first_name", sql.VarChar(50), first_name);
  request.input("last_name", sql.VarChar(50), last_name);
  request.input("email_2", sql.VarChar(100), email_2 || null);
  request.input("mobile_no_1", sql.VarChar(20), mobile_no_1);
  request.input("mobile_no_2", sql.VarChar(20), mobile_no_2 || null);
  request.input("address", sql.VarChar(255), address || null);
  request.input("gender", sql.VarChar(20), gender);
  request.input("nic", sql.VarChar(20), nic);
  request.input("profile_photo", sql.VarBinary(sql.MAX), profile_photo || null);

  const result = await request.query(`
    UPDATE EMP_Emp
    SET
      first_name = @first_name,
      last_name = @last_name,
      email_2 = @email_2,
      mobile_no_1 = @mobile_no_1,
      mobile_no_2 = @mobile_no_2,
      address = @address,
      gender = @gender,
      nic = @nic,
      profile_photo = COALESCE(@profile_photo, profile_photo),
      updated_at = GETDATE()
    OUTPUT
      INSERTED.emp_id,
      INSERTED.emp_code,
      INSERTED.first_name,
      INSERTED.last_name,
      INSERTED.email_1,
      INSERTED.email_2,
      INSERTED.mobile_no_1,
      INSERTED.mobile_no_2,
      INSERTED.address,
      INSERTED.gender,
      INSERTED.nic,
      INSERTED.profile_photo,
      INSERTED.joining_date,
      INSERTED.employment_status,
      INSERTED.designation,
      INSERTED.role_id,
      INSERTED.is_active,
      INSERTED.created_at,
      INSERTED.updated_at
    WHERE emp_id = @emp_id
  `);

  const employee = result.recordset[0];

  return employee ? getMyProfile(emp_id) : null;
};