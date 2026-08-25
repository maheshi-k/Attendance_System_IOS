import sql from "mssql";

export const getDesignationHistory = async (emp_id) => {
  const result = await sql.query`
    SELECT
      designation_history_id,
      emp_id,
      designation,
      effective_from,
      effective_to,
      created_at,
      updated_at
    FROM EMP_DesignationHistory
    WHERE emp_id = ${emp_id}
    ORDER BY effective_from DESC;
  `;

  return result.recordset;
};

export const changeDesignation = async (
  emp_id,
  designation,
  effective_from
) => {
  const transaction = new sql.Transaction();

  try {
    await transaction.begin();

    // 1. Check employee
    const employeeResult = await transaction.request()
      .input("emp_id", sql.Int, emp_id)
      .query(`
        SELECT emp_id
        FROM EMP_Emp
        WHERE emp_id = @emp_id
      `);

    if (employeeResult.recordset.length === 0) {
      throw new Error("Employee not found");
    }

    // 2. Find current designation
    const currentResult = await transaction.request()
      .input("emp_id", sql.Int, emp_id)
      .query(`
        SELECT TOP 1
          designation_history_id,
          designation,
          effective_from
        FROM EMP_DesignationHistory
        WHERE emp_id = @emp_id
          AND effective_to IS NULL
        ORDER BY effective_from DESC
      `);

    const current = currentResult.recordset[0];

    // 3. Close current designation
    if (current) {
      await transaction.request()
        .input(
          "designation_history_id",
          sql.Int,
          current.designation_history_id
        )
        .input(
          "effective_to",
          sql.Date,
          new Date(
            new Date(effective_from).getTime() -
              24 * 60 * 60 * 1000
          )
        )
        .query(`
          UPDATE EMP_DesignationHistory
          SET
            effective_to = @effective_to,
            updated_at = GETDATE()
          WHERE designation_history_id = @designation_history_id
        `);
    }

    // 4. Create new designation history
    await transaction.request()
      .input("emp_id", sql.Int, emp_id)
      .input("designation", sql.VarChar(100), designation)
      .input("effective_from", sql.Date, effective_from)
      .query(`
        INSERT INTO EMP_DesignationHistory (
          emp_id,
          designation,
          effective_from
        )
        VALUES (
          @emp_id,
          @designation,
          @effective_from
        )
      `);

    // 5. Update current designation in EMP_Emp
    const updatedEmployee = await transaction.request()
      .input("emp_id", sql.Int, emp_id)
      .input("designation", sql.VarChar(100), designation)
      .query(`
        UPDATE EMP_Emp
        SET
          designation = @designation,
          updated_at = GETDATE()
        OUTPUT
          INSERTED.emp_id,
          INSERTED.emp_code,
          INSERTED.designation,
          INSERTED.updated_at
        WHERE emp_id = @emp_id
      `);

    await transaction.commit();

    return updatedEmployee.recordset[0];

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};