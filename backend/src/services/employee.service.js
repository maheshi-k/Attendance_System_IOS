import sql from "mssql";
import bcrypt from "bcryptjs";

export const getAllEmployees = async () => {
  const result = await sql.query(`
    SELECT
      e.emp_id,
      e.emp_code,
      e.first_name,
      e.last_name,
      e.email,
      e.role_id,
      r.role_name,
      r.description AS role_description,
      e.profile_photo,
      e.employment_status,
      e.mobile_no,
      e.is_active,
      e.created_at,
      e.updated_at
    FROM EMP_Emp e
    LEFT JOIN ROLE_Role r
      ON e.role_id = r.role_id
    ORDER BY e.emp_id DESC;
  `);

  return result.recordset;
};

export const createEmployee = async (employeeData) => {
  const {
    emp_code,
    first_name,
    last_name,
    email,
    password,
    role_id,
    profile_photo,
    employment_status,
    mobile_no,
  } = employeeData;

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  const result = await sql.query`
    INSERT INTO EMP_Emp (
      emp_code,
      first_name,
      last_name,
      email,
      password_hash,
      role_id,
      profile_photo,
      employment_status,
      mobile_no
    )
    OUTPUT
      INSERTED.emp_id,
      INSERTED.emp_code,
      INSERTED.first_name,
      INSERTED.last_name,
      INSERTED.email,
      INSERTED.role_id,
      INSERTED.profile_photo,
      INSERTED.employment_status,
      INSERTED.mobile_no,
      INSERTED.is_active,
      INSERTED.created_at,
      INSERTED.updated_at
    VALUES (
      ${emp_code},
      ${first_name},
      ${last_name},
      ${email},
      ${passwordHash},
      ${role_id},
      ${profile_photo || null},
      ${employment_status || "Active"},
      ${mobile_no}
    )
  `;

  return result.recordset[0];
};

export const getEmployeeByID = async(emp_id) => {
  const result = await sql.query(`SELECT * FROM EMP_Emp WHERE emp_id = ${emp_id} `);

  return result.recordset[0];
}

export const UpdateEmployeeByID = async (emp_id,employeeData) => {
  const {
    first_name,
    last_name,
    email,
    password,
    role_id,
    profile_photo,
    employment_status,
    mobile_no,
  } = employeeData;

  let query;

  if(password && profile_photo !== undefined){
    query = sql.query`
      UPDATE EMP_Emp SET
        first_name = ${first_name},
        last_name = ${last_name},
        email = ${email},
        password_hash = ${passwordHash},
        role_id = ${role_id},
        profile_photo = ${profile_photo || null},
        employment_status = ${employment_status},
        mobile_no = ${mobile_no},
        updated_at = GETDATE()
      OUTPUT
        INSERTED.emp_id,
        INSERTED.emp_code,
        INSERTED.first_name,
        INSERTED.last_name,
        INSERTED.email,
        INSERTED.role_id,
        INSERTED.profile_photo,
        INSERTED.employment_status,
        INSERTED.mobile_no,
        INSERTED.is_active,
        INSERTED.created_at,
        INSERTED.updated_at
      WHERE emp_id = ${emp_id}
    `;
  } else if (password && profile_photo === undefined) {
    const passwordHash = await bcrypt.hash(password, 10);

    query = await sql.query`
      UPDATE EMP_Emp
      SET
        first_name = ${first_name},
        last_name = ${last_name},
        email = ${email},
        password_hash = ${passwordHash},
        role_id = ${role_id},
        employment_status = ${employment_status},
        mobile_no = ${mobile_no},
        updated_at = GETDATE()
      OUTPUT
        INSERTED.emp_id,
        INSERTED.emp_code,
        INSERTED.first_name,
        INSERTED.last_name,
        INSERTED.email,
        INSERTED.role_id,
        INSERTED.profile_photo,
        INSERTED.employment_status,
        INSERTED.mobile_no,
        INSERTED.is_active,
        INSERTED.created_at,
        INSERTED.updated_at
      WHERE emp_id = ${emp_id}
    `;
  } else if (!password && profile_photo !== undefined) 
  {
      query = await sql.query`
            UPDATE EMP_Emp
            SET
              first_name = ${first_name},
              last_name = ${last_name},
              email = ${email},
              role_id = ${role_id},
              profile_photo = ${profile_photo || null},
              employment_status = ${employment_status},
              mobile_no = ${mobile_no},
              updated_at = GETDATE()
            OUTPUT
              INSERTED.emp_id,
              INSERTED.emp_code,
              INSERTED.first_name,
              INSERTED.last_name,
              INSERTED.email,
              INSERTED.role_id,
              INSERTED.profile_photo,
              INSERTED.employment_status,
              INSERTED.mobile_no,
              INSERTED.is_active,
              INSERTED.created_at,
              INSERTED.updated_at
            WHERE emp_id = ${emp_id}
          `;
    }else {
      query = await sql.query`
      UPDATE EMP_Emp
      SET
        first_name = ${first_name},
        last_name = ${last_name},
        email = ${email},
        role_id = ${role_id},
        employment_status = ${employment_status},
        mobile_no = ${mobile_no},
        updated_at = GETDATE()
      OUTPUT
        INSERTED.emp_id,
        INSERTED.emp_code,
        INSERTED.first_name,
        INSERTED.last_name,
        INSERTED.email,
        INSERTED.role_id,
        INSERTED.employment_status,
        INSERTED.profile_photo,
        INSERTED.mobile_no,
        INSERTED.is_active,
        INSERTED.created_at,
        INSERTED.updated_at
      WHERE emp_id = ${emp_id}
    `;
    }

  return query.recordset[0];
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
      INSERTED.email,
      INSERTED.role_id,
      INSERTED.profile_photo,
      INSERTED.employment_status,
      INSERTED.mobile_no,
      INSERTED.is_active,
      INSERTED.created_at,
      INSERTED.updated_at
    WHERE emp_id = ${emp_id}
  `;

  return result.recordset[0];
}

export const getEmployeeByStatus = async (employment_status) => {
  const result = await sql.query(`
    SELECT * FROM EMP_Emp WHERE employment_status = '${employment_status}'
  `);
  return result.recordset;
}