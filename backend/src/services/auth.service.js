import sql from "mssql";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const loginEmployee = async (email_1, password) => {
  const result = await sql.query`
    SELECT
      emp_id,
      emp_code,
      first_name,
      last_name,
      email_1,
      password_hash,
      role_id,
      is_active
    FROM EMP_Emp
    WHERE email_1 = ${email_1}
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

return {
    token,
    employee: {
      emp_id: employee.emp_id,
      emp_code: employee.emp_code,
      first_name: employee.first_name,
      last_name: employee.last_name,
      email_1: employee.email_1,
      role_id: employee.role_id,
      is_active: employee.is_active,
    },
  };
};