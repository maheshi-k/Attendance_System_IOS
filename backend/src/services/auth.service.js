import sql from "mssql";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const profilePhotoDataUrl = (photo) => {
  if (!photo) {
    return null;
  }

  const buffer = Buffer.isBuffer(photo)
    ? photo
    : Buffer.from(photo.data || photo);

  let mimeType = "image/jpeg";

  if (
    buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  ) {
    mimeType = "image/png";
  } else if (
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    mimeType = "image/webp";
  }

  return `data:${mimeType};base64,${buffer.toString("base64")}`;
};

export const loginEmployee = async (email_1, password) => {
  const result = await sql.query`
    SELECT
      e.emp_id,
      e.emp_code,
      e.first_name,
      e.last_name,
      e.email_1,
      e.password_hash,
      e.role_id,
      e.is_active,
      e.profile_photo,

      r.role_name,

      p.permission_code,
      p.permission_name,
      p.module
    FROM EMP_Emp e
    INNER JOIN ROLE_Role r
      ON e.role_id = r.role_id
    LEFT JOIN ROLE_RolePermission rp
      ON r.role_id = rp.role_id
    LEFT JOIN PER_Permission p
      ON rp.permission_id = p.permission_id
      AND p.is_active = 1
    
    WHERE e.email_1 = ${email_1}
    AND r.is_active = 1
  `;

  if (result.recordset.length === 0) {
    throw new Error("Invalid email_1 or password");
  }

  const employee = result.recordset[0];

  if (!employee.is_active) {
    throw new Error("Employee account is inactive");
  }

  const passwordMatch = await bcrypt.compare(
    password,
    employee.password_hash
  );

  if (!passwordMatch) {
    throw new Error("Invalid email_1 or password");
  }

  const token = jwt.sign(
    {
      emp_id: employee.emp_id,
      emp_code: employee.emp_code,
      role_id: employee.role_id,
      email_1: employee.email_1,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    }
  );

  const permissions = result.recordset
    .filter((row) => row.permission_code)
    .map((row) => ({
      permission_code: row.permission_code,
      permission_name: row.permission_name,
      module: row.module,
    }));

return {
    token,
    employee: {
      emp_id: employee.emp_id,
      emp_code: employee.emp_code,
      first_name: employee.first_name,
      last_name: employee.last_name,
      email_1: employee.email_1,
      profile_photo: profilePhotoDataUrl(employee.profile_photo),
      role_id: employee.role_id,
      role_name: employee.role_name,
      is_active: employee.is_active,
    },
    permissions,
  };
};

export const changeEmployeePassword = async (
  emp_id,
  currentPassword,
  newPassword,
) => {
  const result = await sql.query`
    SELECT password_hash
    FROM EMP_Emp
    WHERE emp_id = ${emp_id} AND is_active = 1
  `;
  const employee = result.recordset[0];

  if (!employee || !(await bcrypt.compare(currentPassword, employee.password_hash))) {
    throw new Error("CURRENT_PASSWORD_INVALID");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await sql.query`
    UPDATE EMP_Emp
    SET password_hash = ${passwordHash}, updated_at = GETDATE()
    WHERE emp_id = ${emp_id}
  `;
};