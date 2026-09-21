import dotenv from "dotenv";
import sql from "mssql";

dotenv.config();

const dbConfig = {
  server: process.env.DB_SERVER,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const run = async () => {
  try {
    const pool = await sql.connect(dbConfig);

    await pool.request().query(`
      IF OBJECT_ID(N'AUTH_PasswordResetToken', N'U') IS NULL
      BEGIN
        CREATE TABLE AUTH_PasswordResetToken (
          reset_id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
          emp_id INT NOT NULL,
          token_hash VARCHAR(64) NOT NULL,
          expires_at DATETIME2 NOT NULL,
          used_at DATETIME2 NULL,
          created_at DATETIME2 NOT NULL CONSTRAINT DF_AUTH_PasswordResetToken_created_at DEFAULT GETDATE()
        );

        CREATE INDEX IX_AUTH_PasswordResetToken_emp_id
          ON AUTH_PasswordResetToken (emp_id);

        CREATE INDEX IX_AUTH_PasswordResetToken_token_hash
          ON AUTH_PasswordResetToken (token_hash);
      END;
    `);

    console.log("Password reset token table is ready.");
  } finally {
    await sql.close();
  }
};

run().catch((error) => {
  console.error("Failed to create password reset token table:", error);
  process.exitCode = 1;
});