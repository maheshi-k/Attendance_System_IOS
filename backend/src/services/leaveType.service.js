import sql from "mssql";

export const getAllLeaveTypes = async () => {
  const result = await sql.query(`
    SELECT
      leave_type_id,
      leave_type_name,
      description,
      max_days,
      is_paid,
      carry_forward,
      carry_forward_days,
      is_active,
      created_at,
      updated_at
    FROM LEAVE_LeaveType
    WHERE is_active = 1
    ORDER BY leave_type_id DESC;
  `);

  return result.recordset;
};

export const getLeaveTypeByID = async (leave_type_id) => {
  const result = await sql.query`
    SELECT
      leave_type_id,
      leave_type_name,
      description,
      max_days,
      is_paid,
      carry_forward,
      carry_forward_days,
      is_active,
      created_at,
      updated_at
    FROM LEAVE_LeaveType
    WHERE leave_type_id = ${leave_type_id}
      AND is_active = 1
  `;

  return result.recordset[0] || null;
};

export const createLeaveType = async (leaveTypeData) => {
  const {
    leave_type_name,
    description,
    max_days,
    is_paid = true,
    carry_forward = false,
    carry_forward_days,
  } = leaveTypeData;

  const request = new sql.Request();

  request.input("leave_type_name", sql.VarChar(100), leave_type_name);
  request.input("description", sql.VarChar(255), description || null);
  request.input("max_days", sql.Decimal(5, 2), max_days);
  request.input("is_paid", sql.Bit, is_paid);
  request.input("carry_forward", sql.Bit, carry_forward);
  request.input(
    "carry_forward_days",
    sql.Decimal(5, 2),
    carry_forward ? carry_forward_days : null
  );

  const result = await request.query(`
    INSERT INTO LEAVE_LeaveType (
      leave_type_name,
      description,
      max_days,
      is_paid,
      carry_forward,
      carry_forward_days
    )
    OUTPUT
      INSERTED.leave_type_id,
      INSERTED.leave_type_name,
      INSERTED.description,
      INSERTED.max_days,
      INSERTED.is_paid,
      INSERTED.carry_forward,
      INSERTED.carry_forward_days,
      INSERTED.is_active,
      INSERTED.created_at,
      INSERTED.updated_at
    VALUES (
      @leave_type_name,
      @description,
      @max_days,
      @is_paid,
      @carry_forward,
      @carry_forward_days
    )
  `);

  return result.recordset[0];
};

export const updateLeaveType = async (leave_type_id, leaveTypeData) => {
  const {
    leave_type_name,
    description,
    max_days,
    is_paid,
    carry_forward,
    carry_forward_days,
  } = leaveTypeData;

  const request = new sql.Request();

  request.input("leave_type_id", sql.Int, leave_type_id);
  request.input("leave_type_name", sql.VarChar(100), leave_type_name);
  request.input("description", sql.VarChar(255), description || null);
  request.input("max_days", sql.Decimal(5, 2), max_days);
  request.input("is_paid", sql.Bit, is_paid);
  request.input("carry_forward", sql.Bit, carry_forward);
  request.input(
    "carry_forward_days",
    sql.Decimal(5, 2),
    carry_forward ? carry_forward_days : null
  );

  const result = await request.query(`
    UPDATE LEAVE_LeaveType
    SET
      leave_type_name = @leave_type_name,
      description = @description,
      max_days = @max_days,
      is_paid = @is_paid,
      carry_forward = @carry_forward,
      carry_forward_days = @carry_forward_days,
      updated_at = GETDATE()
    OUTPUT
      INSERTED.leave_type_id,
      INSERTED.leave_type_name,
      INSERTED.description,
      INSERTED.max_days,
      INSERTED.is_paid,
      INSERTED.carry_forward,
      INSERTED.carry_forward_days,
      INSERTED.is_active,
      INSERTED.created_at,
      INSERTED.updated_at
    WHERE leave_type_id = @leave_type_id
  `);

  return result.recordset[0] || null;
};

export const deleteLeaveType = async (leave_type_id) => {
  const request = new sql.Request();

  request.input("leave_type_id", sql.Int, leave_type_id);

  const result = await request.query(`
    UPDATE LEAVE_LeaveType
    SET
      is_active = 0,
      updated_at = GETDATE()
    WHERE leave_type_id = @leave_type_id
  `);

  return result.rowsAffected[0] > 0;
};