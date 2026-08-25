import sql from "mssql";
import { connectDB } from "../src/config/db.js";

const migration = async () => {
  await connectDB();

  const transaction = new sql.Transaction();

  try {
    await transaction.begin();

    await transaction.request().query(`
      IF OBJECT_ID(N'dbo.ROLE_Role', N'U') IS NULL
      BEGIN
        CREATE TABLE dbo.ROLE_Role (
          role_id INT IDENTITY(1, 1) NOT NULL CONSTRAINT PK_ROLE_Role PRIMARY KEY,
          role_name VARCHAR(100) NOT NULL,
          description VARCHAR(255) NULL,
          is_active BIT NOT NULL CONSTRAINT DF_ROLE_Role_is_active DEFAULT (1),
          created_at DATETIME2 NOT NULL CONSTRAINT DF_ROLE_Role_created_at DEFAULT (GETDATE()),
          updated_at DATETIME2 NOT NULL CONSTRAINT DF_ROLE_Role_updated_at DEFAULT (GETDATE()),
          CONSTRAINT UQ_ROLE_Role_role_name UNIQUE (role_name)
        );
      END;

      IF OBJECT_ID(N'dbo.EMP_Emp', N'U') IS NULL
      BEGIN
        CREATE TABLE dbo.EMP_Emp (
          emp_id INT IDENTITY(1, 1) NOT NULL CONSTRAINT PK_EMP_Emp PRIMARY KEY,
          emp_code VARCHAR(20) NOT NULL,
          first_name VARCHAR(50) NOT NULL,
          last_name VARCHAR(50) NOT NULL,
          email_1 VARCHAR(100) NOT NULL,
          email AS email_1,
          email_2 VARCHAR(100) NULL,
          password_hash VARCHAR(255) NOT NULL,
          nic VARCHAR(20) NOT NULL,
          gender VARCHAR(20) NOT NULL,
          address VARCHAR(255) NULL,
          role_id INT NOT NULL,
          profile_photo VARBINARY(MAX) NULL,
          employment_status VARCHAR(30) NOT NULL CONSTRAINT DF_EMP_Emp_employment_status DEFAULT ('Active'),
          mobile_no_1 VARCHAR(20) NOT NULL,
          mobile_no_2 VARCHAR(20) NULL,
          joining_date DATE NOT NULL,
          designation VARCHAR(100) NOT NULL,
          is_active BIT NOT NULL CONSTRAINT DF_EMP_Emp_is_active DEFAULT (1),
          created_at DATETIME2 NOT NULL CONSTRAINT DF_EMP_Emp_created_at DEFAULT (GETDATE()),
          updated_at DATETIME2 NOT NULL CONSTRAINT DF_EMP_Emp_updated_at DEFAULT (GETDATE()),
          CONSTRAINT UQ_EMP_Emp_emp_code UNIQUE (emp_code),
          CONSTRAINT UQ_EMP_Emp_email_1 UNIQUE (email_1),
          CONSTRAINT UQ_EMP_Emp_nic UNIQUE (nic),
          CONSTRAINT FK_EMP_Emp_role FOREIGN KEY (role_id) REFERENCES dbo.ROLE_Role (role_id)
        );
      END;

      IF OBJECT_ID(N'dbo.EMP_DesignationHistory', N'U') IS NULL
      BEGIN
        CREATE TABLE dbo.EMP_DesignationHistory (
          designation_history_id INT IDENTITY(1, 1) NOT NULL CONSTRAINT PK_EMP_DesignationHistory PRIMARY KEY,
          emp_id INT NOT NULL,
          designation VARCHAR(100) NOT NULL,
          effective_from DATE NOT NULL,
          effective_to DATE NULL,
          created_at DATETIME2 NOT NULL CONSTRAINT DF_EMP_DesignationHistory_created_at DEFAULT (GETDATE()),
          updated_at DATETIME2 NOT NULL CONSTRAINT DF_EMP_DesignationHistory_updated_at DEFAULT (GETDATE()),
          CONSTRAINT FK_EMP_DesignationHistory_emp FOREIGN KEY (emp_id) REFERENCES dbo.EMP_Emp (emp_id)
        );
      END;

      IF OBJECT_ID(N'dbo.ATT_QR', N'U') IS NULL
      BEGIN
        CREATE TABLE dbo.ATT_QR (
          qr_id INT IDENTITY(1, 1) NOT NULL CONSTRAINT PK_ATT_QR PRIMARY KEY,
          qr_token VARCHAR(64) NOT NULL,
          is_active BIT NOT NULL CONSTRAINT DF_ATT_QR_is_active DEFAULT (1),
          created_at DATETIME2 NOT NULL CONSTRAINT DF_ATT_QR_created_at DEFAULT (GETDATE()),
          updated_at DATETIME2 NOT NULL CONSTRAINT DF_ATT_QR_updated_at DEFAULT (GETDATE()),
          CONSTRAINT UQ_ATT_QR_qr_token UNIQUE (qr_token)
        );
      END;

      IF OBJECT_ID(N'dbo.ATT_Attendance', N'U') IS NULL
      BEGIN
        CREATE TABLE dbo.ATT_Attendance (
          att_id INT IDENTITY(1, 1) NOT NULL CONSTRAINT PK_ATT_Attendance PRIMARY KEY,
          emp_id INT NOT NULL,
          att_date DATE NOT NULL,
          check_in TIME NOT NULL,
          check_out TIME NULL,
          status VARCHAR(20) NOT NULL,
          created_at DATETIME2 NOT NULL CONSTRAINT DF_ATT_Attendance_created_at DEFAULT (GETDATE()),
          updated_at DATETIME2 NOT NULL CONSTRAINT DF_ATT_Attendance_updated_at DEFAULT (GETDATE()),
          CONSTRAINT FK_ATT_Attendance_emp FOREIGN KEY (emp_id) REFERENCES dbo.EMP_Emp (emp_id),
          CONSTRAINT UQ_ATT_Attendance_emp_date UNIQUE (emp_id, att_date)
        );
      END;
    `);

    await transaction.commit();
    console.log("Database migration completed successfully.");
  } catch (error) {
    await transaction.rollback();
    console.error("Database migration failed:", error);
    process.exitCode = 1;
  } finally {
    await sql.close();
  }
};

await migration();